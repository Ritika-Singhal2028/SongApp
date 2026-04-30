const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// Middleware to check if logged in
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};

// INDEX - show all songs
router.get('/', isLoggedIn, async (req, res) => {
    const songs = await Song.find({}).populate('user');
    res.render('songs/index', { songs });
});

// NEW - show form to create new song
router.get('/new', isLoggedIn, (req, res) => {
    res.render('songs/new');
});

// CREATE - add new song
router.post('/', isLoggedIn, async (req, res) => {
    const { songName, duration, singer } = req.body;
    const song = new Song({ songName, duration, singer, user: req.user._id });
    await song.save();
    res.redirect('/songs');
});

// SHOW - show info about one song
router.get('/:id', isLoggedIn, async (req, res) => {
    const song = await Song.findById(req.params.id).populate('user');
    res.render('songs/show', { song });
});

// EDIT - show edit form (only allows changing songName per instructions)
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const song = await Song.findById(req.params.id);
    // Optional: check if song belongs to user
    res.render('songs/edit', { song });
});

// UPDATE - update songName
router.put('/:id', isLoggedIn, async (req, res) => {
    const { songName } = req.body;
    await Song.findByIdAndUpdate(req.params.id, { songName });
    res.redirect(`/songs/${req.params.id}`);
});

// DELETE - delete song
router.post('/:id/delete', isLoggedIn, async (req, res) => {
    await Song.findByIdAndDelete(req.params.id);
    res.redirect('/songs');
});

module.exports = router;
