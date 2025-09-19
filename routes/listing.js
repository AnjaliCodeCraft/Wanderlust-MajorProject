const express = require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const {isLoggedin, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});
 

router.route("/")
.get(wrapAsync(listingController.index))//INDEX ROUTE
.post(isLoggedin, upload.single('listing[image]'), wrapAsync(listingController.createListing));//CREATE ROUTE


//NEW ROUTE
router.get("/new",isLoggedin, wrapAsync(listingController.renderNewForm));

router.route("/:id")
.put(isLoggedin, isOwner, upload.single('listing[image]'),  validateListing, wrapAsync(listingController.updateListing))//UPDATE ROUTE
.delete(isLoggedin, isOwner,  wrapAsync(listingController.destroyListing))//DELETE ROUTE
.get(wrapAsync(listingController.showListing));//SHOW ROUTE


//edit listing
router.get("/:id/edit" ,isLoggedin, isOwner, wrapAsync(listingController.renderEditForm));


// CREATE ROUTE
// router.post("/",isLoggedin,validateListing, wrapAsync(listingController.createListing));

//UPDATE ROUTE
// router.put("/:id",isLoggedin, isOwner, validateListing, wrapAsync(listingController.updateListing));

//Delete route

// router.delete("/:id",isLoggedin, isOwner,  wrapAsync(listingController.destroyListing));

//SHOW ROUTE
// router.get("/:id",wrapAsync(listingController.showListing));

module.exports = router;
