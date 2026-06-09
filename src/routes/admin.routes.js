import express from "express";
import Product from "../models/product.model.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import multer from "multer";
import uploadFileToImageKit from '../Services/storage.service.js'
const storage = multer.memoryStorage();
const upload = multer({
    storage,
})
const router = express.Router();

router.patch(
  "/best-deal/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Toggle OFF if already best deal
      if (product.isBestDeal) {
        product.isBestDeal = false;
        await product.save();

        return res.status(200).json({
          success: true,
          message: "Removed from Best Deals",
          product,
        });
      }

      // Count existing best deals
      const bestDeals = await Product
        .find({ isBestDeal: true })
        .sort({ updatedAt: 1 });

      // If already 5 → remove oldest
      if (bestDeals.length >= 5) {
        const oldest = bestDeals[0];

        oldest.isBestDeal = false;
        await oldest.save();
      }

      // Add new best deal
      product.isBestDeal = true;
      await product.save();

      return res.status(200).json({
        success: true,
        message: "Added to Best Deals",
        product,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }
);


router.post(
  "/product",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          message: "Image file required",
        });
      }

      const uploadedImage = await uploadFileToImageKit(req.file.buffer.toString('base64'))

      const imageUrl = uploadedImage.url;

      const { name, stores, bestStore } = req.body;

      const parsedStores = JSON.parse(stores);
      const parsedBestStore = JSON.parse(bestStore);

      const product = await Product.create({
        name,
        image: imageUrl,
        stores: parsedStores,
        bestStore: parsedBestStore,
      });

      res.status(201).json({
        message: "Product added successfully",
        product,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);


router.delete(
  "/product/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      await product.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        deletedProductId: id,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }
);


router.get(
  "/products",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {

      const products = await Product
        .find()
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: products.length,
        products,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }
);


export default router;