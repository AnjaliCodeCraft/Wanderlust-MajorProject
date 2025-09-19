const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
    },
    description: String,
     image: {
    filename: {
      type: String,
      default: "default_image",
    },
    url: {
      type: String,
    },
//     url: {
//   type: String,
//   set: (v) =>
//     v === ""
//       ? "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=60"
//       : v,
// },
  },
    price: {
      type: Number,
      default: 0
    },
    location: String,
    country: String,
    reviews:[
      {
      type:Schema.Types.ObjectId,
      ref:"Review",
    },
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id : {$in: listing.review}});
  }
});
const Listing = new mongoose.model("Listing",listingSchema);
module.exports= Listing; 

