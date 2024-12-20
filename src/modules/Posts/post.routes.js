import { Router } from "express";
import auth from "../../middlewares/authMiddleware.js";
import expressAsyncHandler from "express-async-handler";
import * as postController from "./post.controller.js";

const router = Router();


router.post("/", auth, expressAsyncHandler(postController.createPost))
router.post("/:postId", auth, expressAsyncHandler(postController.likeUnlike))
router.get("/:postId", expressAsyncHandler(postController.getPost))
router.patch("/:postId", auth, expressAsyncHandler(postController.updatePost))
router.delete("/:postId", auth, expressAsyncHandler(postController.deletePost))


router.post("/:postId/createComment", auth, expressAsyncHandler(postController.createComment))
router.patch("/:postId/:commentId", auth, expressAsyncHandler(postController.updateComment))
router.delete("/:postId/:commentId", auth, expressAsyncHandler(postController.deleteComent))

export default router;