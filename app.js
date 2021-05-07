/**
 * The main app module for WeCamp.
 */

// Require --------------------------------------------------------------------
if (process.env.NODE_ENV !== 'prod') {
    require('dotenv').config();
}

const ejsMate = require('ejs-mate');
const express = require('express');
const flash = require('connect-flash');
const mehtodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const MongoDBStore = require('connect-mongo')(session);

const ExpressError = require('./utils/ExpressError');


// Database -------------------------------------------------------------------
const dbUrl = process.env.DB;
// const dbUrl = 'mongodb://localhost:27017/WeCamp';
mongoose.connect(dbUrl, {
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
const SECRET = process.env.SECRET || 'thisshouldbebetter';

const store = new MongoDBStore({
    url: dbUrl,
    secret: SECRET,
    touchAfter: 24 * 60 * 60
});

store.on('error', function (e) {
    console.log('Session store errors!', e)
});


const sessionConfig = {
    store,
    name: 'session',
    secret: SECRET,
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes ---------------------------------------------------------------------

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


app.get('/', (req, res) => {
    res.render('home');
});

const Campground = require('./models/campground');

app.get('/explore', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('explore', {campgrounds});
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
