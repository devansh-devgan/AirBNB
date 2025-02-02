const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
.get(wrapAsync(listingController.index))//All listings
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.create))//create

//new
router.get("/new", isLoggedIn, listingController.new)

//edit
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.edit))

router.route("/:id")
.get(wrapAsync(listingController.show))//show
.put(isOwner, isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.update))//update
.delete(isOwner, isLoggedIn, wrapAsync(listingController.delete))//delete

module.exports = router;