import Buyer from "../../../DB/models/buyer.model.js";
import Post from "../../../DB/models/Post/post.model.js";
import Seller from "../../../DB/models/seller.model.js";
import Comment from "../../../DB/models/Post/comment.model.js";


const getUserModel = (role) => role === "buyer" ? Buyer : Seller;


export const createPost = async (req, res, next) => {
  const { content } = req.body;
  const { id, role } = req.user;

  if (role === "buyer")
    return next(new Error("Only sellers are allowed to create posts", { cause: 401 }));

  const post = await Post.create({ content, seller: id });
  let seller = await Seller.findById(id);

  seller.posts.push(post._id);
  await seller.save();

  res.status(200).json({ message: "created post seccess", post });
}

export const getPost = async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).populate("seller");

  if (!post)
    return next(new Error("post not found", { cause: 404 }))

  res.status(200).json({ message: "done", post })
}

export const updatePost = async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { id } = req.user;

  let post = await Post.findById(postId).populate("seller")
  if (!post)
    return next(new Error("post not found", { cause: 404 }))

  if (post.seller._id.toString() !== id)
    return next(new Error("can not update this post", { cause: 401 }))

  post = await Post.findByIdAndUpdate(postId, {
    content
  }, { new: true });

  res.status(200).json({ message: "update post seccess", post });
}

export const deletePost = async (req, res, next) => {
  const { postId } = req.params;
  const { id } = req.user;

  const post = await Post.findById(postId)
  if (!post)
    return next(new Error("post not found", { cause: 404 }))

  if (post.seller.toString() !== id)
    return next(new Error("can not delete this post", { cause: 401 }))

  const seller = await Seller.findByIdAndUpdate(id, {
    $pull: { posts: postId }
  })

  await Post.findByIdAndDelete(postId)
  res.status(200).json({ message: "delete post seccess" })
}
export const likeUnlike = async (req, res, next) => {
  const { postId } = req.params;
  const { id, role } = req.user;

  const post = await Post.findById(postId);
  if (!post) return next(new Error("Post not found", { cause: 404 }));

  const Model = getUserModel(role);
  const user = await Model.findById(id);

  if (!user) return next(new Error("User not found", { cause: 404 }));

  if (!post.likes.includes(user._id)) {
    post.likes.push(user._id);
    await post.save();
    return res.status(200).json({ message: "Like post successfully" })
  }
  post.likes.pull(user._id);
  await post.save();
  res.status(200).json({ message: "Unlike post successfully" })
}

export const createComment = async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { role, id } = req.user;

  const Model = getUserModel(role);
  const user = await Model.findById(id);

  const post = await Post.findById(postId).populate("comments");
  if (!post) return next(new Error("Post not found", { cause: 404 }));

  const comment = await Comment.create({
    content, post: postId, user: user._id, userType: role === "buyer" ? "Buyer" : "Seller"
  });

  // console.log(comment._id)
  post.comments.push(comment._id);
  await post.save();

  res.status(201).json({ message: "Created comment sseccessfully", post })
}

export const updateComment = async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { id, role } = req.user;
  const { content } = req.body;


  const post = await Post.findById(postId);
  const comment = await Comment.findById(commentId).populate("user");

  if (!post) return next(new Error("Post not found", { cause: 404 }));
  if (!comment) return next(new Error("Comment not found", { cause: 404 }));

  if (comment.user.toString() !== id)
    return next(new Error("Unauthorized to edit this comment", { cause: 401 }));

  comment.content = content || comment.content;
  await comment.save();

  res.status(200).json({ message: "Update comment seccessfully", comment })
}

export const deleteComent = async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { id } = req.user;

  const post = await Post.findById(postId);
  const comment = await Comment.findOne({
    _id: commentId,
    user: id,
    post: postId
  });

  if (!post) return next(new Error("Post not found", { cause: 404 }));
  if (!comment) return next(new Error("Comment not found", { cause: 404 }));

  if (comment.user.toString() !== id)
    return next(new Error("Unauthorized to delete this comment", { cause: 401 }));

  await Comment.findByIdAndDelete(commentId);
  post.comments.pull(commentId);
  await post.save();
  res.status(200).json({ message: "Comment deleted successfully" })
}