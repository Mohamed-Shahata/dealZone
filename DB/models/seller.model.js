import { Query, Schema, model } from "mongoose";
import Product from "./product.model.js";
import Post from "./Post/post.model.js";

const sellerSchema = new Schema({
  name: { type: String, trim: true, minlength: 2 },
  bio: { type: String, trim: true, minlength: 4 },
  email: { type: String, tirm: true, unique: true },
  password: { type: String, tirm: true, minlength: 8 },
  profileImage: {
    secure_url: { type: String },
    public_id: { type: String }
  },
  followers: [
    { type: Schema.Types.ObjectId, ref: "Buyer" }
  ],
  products: [
    { type: Schema.Types.ObjectId, ref: "Product" },
  ],
  posts: [
    { type: Schema.Types.ObjectId, ref: "Post" },
  ],
  role: {
    type: String,
    default: "seller"
  }
}, { timestamps: true });


sellerSchema.pre("findOneAndDelete", async function (next) {
  const sellerId = this.getQuery()._id;

  await Product.deleteMany({ seller: sellerId });
  await Post.deleteMany({ seller: sellerId });
  next();
})



const Seller = model("Seller", sellerSchema);
export default Seller;