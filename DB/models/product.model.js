import { Schema, model } from "mongoose";

const productSchmea = new Schema({
  name: { type: String, trim: true, minlength: 2 },
  description: { type: String, trim: true, minlength: 10 },
  price: { type: Number, min: 0 },
  category: { type: String },
  images: [{
    secure_url: { type: String },
    public_id: { type: String }
  }],
  seller: { type: Schema.Types.ObjectId, ref: "Seller" },
  ratings: [
    {
      buyer: { type: Schema.Types.ObjectId, ref: "Buyer" },
      reating: { type: Number },
      review: { type: String }
    },
  ],
  avarageRating: { type: Number, default: 0 }
}, { timestamps: true });

const Product = model("Product", productSchmea);
export default Product;