import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as buyerAndSellerController from "./BuyerAndSeller.controller.js";
import auth from "../../middlewares/authMiddleware.js";

const router = Router();

router.post("/", expressAsyncHandler(buyerAndSellerController.createBuyer))
router.post("/:userId", auth, expressAsyncHandler(buyerAndSellerController.followUnfollow))
router.get("/:userId", expressAsyncHandler(buyerAndSellerController.getProfile))
router.patch("/:userId", auth, expressAsyncHandler(buyerAndSellerController.updateUser))
router.delete("/:userId", auth, expressAsyncHandler(buyerAndSellerController.deleteUser))



export default router;