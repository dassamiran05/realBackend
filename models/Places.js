import mongoose from "mongoose";

const placesSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    title: String,
    address: String,
    photos: [Object],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
    price: Number,
  },
  { timestamps: true }
);
export default mongoose.model("Place", placesSchema);
