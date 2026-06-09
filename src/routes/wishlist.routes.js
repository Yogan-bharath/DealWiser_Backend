import { Router } from "express";

import {
  getWishlist,
  addWishlist,
  removeWishlist
} from "../controllers/wishlist.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();


router.get("/", authMiddleware, getWishlist);

router.post("/", authMiddleware, addWishlist);

router.delete("/:productId", authMiddleware, removeWishlist);


export default router;