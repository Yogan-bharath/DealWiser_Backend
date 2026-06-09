import Wishlist from "../models/wishlist.model.js";


/**
 * GET: /api/wishlist
 * Get logged-in user's wishlist
 */
export const getWishlist = async (req, res) => {

  try {

    const items = await Wishlist.find({
      user: req.user.id
    });

    res.status(200).json(items);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch wishlist",
      error: error.message
    });

  }

};


/**
 * POST: /api/wishlist
 * Add product to wishlist
 */
export const addWishlist = async (req, res) => {

  try {

    const {
      productId,
      name,
      image,
      prices,
      link
    } = req.body;


    // prevent duplicates
    const exists = await Wishlist.findOne({
      user: req.user.id,
      productId
    });

    if (exists) {
      return res.status(409).json({
        message: "Product already in wishlist"
      });
    }


    const newItem = await Wishlist.create({
      user: req.user.id,
      productId,
      name,
      image,
      prices,
      link
    });

    res.status(201).json(newItem);

  } catch (error) {

    res.status(500).json({
      message: "Failed to add wishlist item",
      error: error.message
    });

  }

};


/**
 * DELETE: /api/wishlist/:productId
 * Remove product from wishlist
 */
export const removeWishlist = async (req, res) => {

  try {

    const { productId } = req.params;

    await Wishlist.deleteOne({
      user: req.user.id,
      productId
    });

    res.status(200).json({
      message: "Removed from wishlist"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to remove wishlist item",
      error: error.message
    });

  }

};