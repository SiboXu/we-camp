/**
 * The user route controllers.
 */

// Require --------------------------------------------------------------------


const User = require('../models/user');


// ----------------------------------------------------------------------------


module.exports.userRender = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        console.log(req)
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            console.log(registeredUser);
            req.flash('success', 'Welcome to WeCamp!');
            res.redirect('/campgrounds');
        });

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.loginRender = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    console.log(redirectUrl);
    console.log(req.session);
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
};
