const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register User
router.post('/register', async (req, res) => {
    try {
        const { name, password, phone } = req.body;

        // تحقق من صحة البيانات
        if (!name || name.length < 3) {
            return res.status(400).json({ message: 'الاسم يجب أن يكون 3 أحرف على الأقل' });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' });
        }
        const phoneRegex = /^01[0-9]{9}$/;
        if (!phone || !phoneRegex.test(phone)) {
            return res.status(400).json({ message: 'يرجى إدخال رقم هاتف مصري صحيح (11 رقم ويبدأ بـ 01)' });
        }

        // Check if user exists
        let user = await User.findOne({ phone });
        console.log('Checking for existing user with phone:', phone);
        console.log('Found user:', user);
        if (user) {
            return res.status(400).json({ message: 'رقم الهاتف مستخدم بالفعل' });
        }

        // Create new user
        user = new User({
            name,
            password,
            phone
        });

        console.log('Creating new user:', { name, phone });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        console.log('User saved successfully');

        res.status(201).json({ message: 'تم التسجيل بنجاح. يرجى انتظار موافقة الإدارة.' });
    } catch (err) {
        console.error('Registration error details:', {
            message: err.message,
            code: err.code,
            name: err.name,
            stack: err.stack
        });
        if (err.code === 11000) {
            return res.status(400).json({ message: 'رقم الهاتف مستخدم بالفعل' });
        }
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: errors.join(', ') });
        }
        res.status(500).json({ message: 'خطأ في الخادم' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: 'بيانات الدخول غير صحيحة' });
        }

        // Check if user is approved
        if (!user.isApproved) {
            return res.status(400).json({ message: 'حسابك في انتظار موافقة الإدارة' });
        }
        // Check if user is blocked
        if (user.isBlocked) {
            return res.status(403).json({ message: 'تم حظر حسابك من قبل الإدارة' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'بيانات الدخول غير صحيحة' });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get current user info
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; 