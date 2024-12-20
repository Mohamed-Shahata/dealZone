import { Schema, model } from "mongoose";
// import Comment from "./comment.model.js";

const postSchmea = new Schema({
  content: { type: String },
  images: [{
    secure_url: { type: String },
    public_id: { type: String }
  }],
  seller: { type: Schema.Types.ObjectId, ref: "Seller" },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "Buyer"
  }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
}, { timestamps: true });



// postSchmea.pre("findOneAndDelete", async function (next) {
//   const postId = this.getQuery()._id;

//   await Comment.deleteMany({ post: postId , });
//   next()
// })



const Post = model("Post", postSchmea);
export default Post;