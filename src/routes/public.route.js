import express from 'express'
const router = express.Router()
import Product from "../models/product.model.js";

router.get("/best-deals", async (req, res) => {

  const deals = await Product.find({ isBestDeal: true })
    .sort({ updatedAt: -1 })
    .limit(5);

  res.json(deals);

});

router.get("/recent", async (req, res) => {

  const products = await Product.find()
    .sort({ createdAt: -1 });

  res.json(products);

});

router.get("/search", async (req, res) => {

  try {

    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const keywords = q.split(" ");

    const products = await Product.find({
      name: {
        $regex: keywords.join("|"),
        $options: "i"
      }
    });

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});
export default router