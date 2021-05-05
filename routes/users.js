const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

router.get('/register', users.userRender);

router.post('/register', catchAsync(users.register));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post(
    '/login', passport.authenticate(
        'local', { failureFlash: true, failureRedirect: '/login' }
    ), catchAsync(
        users.loginRender
    ));

router.get('/logout', users.logout);

module.exports = router;
