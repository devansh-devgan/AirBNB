const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//POST Review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.post))

//DELETE Review
router.delete("/:reviewId", isReviewAuthor, isLoggedIn, wrapAsync(reviewController.delete))

module.exports = router;