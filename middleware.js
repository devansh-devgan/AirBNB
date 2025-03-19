const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");



module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        // Store the current URL as redirectUrl only if it's not a login/logout related page
        if (!req.originalUrl.includes('/login') && 
            !req.originalUrl.includes('/logout') && 
            !req.originalUrl.includes('/signup')) {
            
            req.session.redirectUrl = req.originalUrl;
            
            // Save the session explicitly to ensure changes are persisted
            req.session.save();
        }
        req.flash("error", "Login to add you BNB");
        return res.redirect("/login");
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!res.locals.currUser) {
        req.flash("error", "Login to make changes to the BNB");
        return res.redirect(`/listings/${id}`);
    }
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of the BNB");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!res.locals.currUser) {
        req.flash("error", "Login to delete the review");
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next()
    }
}

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next()
    }
}