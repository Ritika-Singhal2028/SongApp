const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const path = require('path');
const methodOverride = require('method-override');

const User = require('./models/User');

const indexRoutes = require('./routes/index');
const songRoutes = require('./routes/songs');

const app = express();

// DB Connection
mongoose.connect('mongodb://127.0.0.1:27017/songAppTest').then(() => {
    console.log("MONGO CONNECTION OPEN!");
}).catch(err => {
    console.log("OH NO MONGO CONNECTION ERROR!");
    console.log(err);
});

// App Config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Session Config
const sessionConfig = {
    secret: 'super150secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use('/', indexRoutes);
app.use('/songs', songRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
