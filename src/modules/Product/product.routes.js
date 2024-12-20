import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as controllerProduct from "./product.controller.js"
import auth from "../../middlewares/authMiddleware.js";

const router = Router();

router.post("/", auth, expressAsyncHandler(controllerProduct.createProduct))
router.post("/:productId", auth, expressAsyncHandler(controllerProduct.addAndRemoveFavorite))
router.get("/:productId", auth, expressAsyncHandler(controllerProduct.getProduct))
router.patch("/:productId", auth, expressAsyncHandler(controllerProduct.updateProduct))
router.delete("/:productId", auth, expressAsyncHandler(controllerProduct.deleteProduct))


export default router;