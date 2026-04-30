const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Middleware to pass currentUser to all views
router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

router.get('/', (req, res) => {
    res.redirect('/songs');
});

// Register
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, gender, address_location } = req.body;
        const user = new User({ username, gender, address: { location: address_location } });
        await User.register(user, password);
        passport.authenticate('local')(req, res, () => {
            res.redirect('/songs');
        });
    } catch (e) {
        console.error(e);
        res.redirect('/register');
    }
});

// Login
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/songs',
    failureRedirect: '/login'
}));

// Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
});

module.exports = router;
