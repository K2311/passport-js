const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();


router.post('/register', async (req,res)=>{
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error: error.message });
    }
});


router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: info.message || 'Invalid credentials',
            });
        }

        req.login(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                },
            });
        });
    })(req, res, next);
});


router.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({
            success: true,
            message: 'User dashboard',
            data: { other_info: 'This is user dashboard' }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Please log in to access this resource'
        });
    }
});




module.exports = router;