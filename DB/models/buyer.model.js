import { Schema, model } from "mongoose";

const buyerSchema = new Schema({
  name: { type: String, trim: true, minlength: 2 },
  age: { type: String, trim: true, },
  bio: { type: String, trim: true, minlength: 4 },
  email: { type: String, tirm: true, unique: true },
  password: { type: String, tirm: true, minlength: 8 },
  profileImage: {
    secure_url: { type: String },
    public_id: { type: String }
  },
  following: [
    { type: Schema.Types.ObjectId, ref: "Seller" },
  ],
  favorites: [
    { type: Schema.Types.ObjectId, ref: "Product" },
  ],
  role: {
    type: String,
    default: "buyer"
  }
}, { timestamps: true });

const Buyer = model("Buyer", buyerSchema);
export default Buyer;