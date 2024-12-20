import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, refPath: "userType" },
  userType: { type: String, required: true, enum: ["Seller", "Buyer"] },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  likes: [{
    user: { type: Schema.Types.ObjectId, refPath: "likes.userType" },
    userType: { type: String, required: true, enum: ["Seller", "Buyer"] },
  }],
}, { timestamps: true });


const Comment = model("Comment", commentSchema);
export default Comment;