const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding.js');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });-

require("dotenv").config();
const cloudinary = require("cloudinary").v2;


module.exports.index = async (req,res) => {
    let filter = {};
    if (req.query.category) {
        filter.category = req.query.category;
    }
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, "i");
        filter.$or = [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex }
        ];
    }
    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", {allListings, selectedCategory: req.query.category || "", searchQuery: req.query.search || "", page: "index" });
}

module.exports.new = (req,res) => {
    res.render("listings/new.ejs");
}

module.exports.show = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found !");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.create = async (req,res) => {

    let coordinates = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()

    //let {title, description, image, price, country, location} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = coordinates.body.features[0].geometry;

    let savedListing = await newListing.save();
    //console.log(savedListing);

    req.flash("success", "New Listing Created !");
    res.redirect("/listings");
}

module.exports.edit = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found !");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.update = async (req,res) => {

    let coordinates = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()

    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    listing.geometry = coordinates.body.features[0].geometry;

    let savedListing = await listing.save();
    // console.log(savedListing);

    if(typeof req.file !== "undefined"){
        cloudinary.uploader.destroy(listing.image.filename, {invalidate: true});
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    cloudinary.uploader.destroy(deletedListing.image.filename, {invalidate: true});
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings");
}