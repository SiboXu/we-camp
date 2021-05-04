/**
 * The main app module for WeCamp.
 */

// Require --------------------------------------------------------------------

const ejsMate = require('ejs-mate');
const express = require('express');
const flash = require('connect-flash');
const mehtodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const ExpressError = require('./utils/ExpressError');


// Database -------------------------------------------------------------------

mongoose.connect('mongodb://localhost:27017/WeCamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Datbase connected.");
});


// Express --------------------------------------------------------------------

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mehtodOverride('_method'));


const sessionConfig = {
    secret: 'thisshouldbebetter',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes ---------------------------------------------------------------------

const campground = require('./routes/campgrounds');
const review = require('./routes/reviews');

app.use('/campgrounds', campground);
app.use('/campgrounds/:id/reviews', review);


app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!!';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});
