/**
 * The reviews routers module for WeCamp.
 */

// Require --------------------------------------------------------------------

const express = require('express');
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn } = require('../utils/middleware');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const review = require('../models/review');

router.get('/', catchAsync(reviews.reviewRedirect));

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, catchAsync(reviews.deleteReview));


module.exports = router;
