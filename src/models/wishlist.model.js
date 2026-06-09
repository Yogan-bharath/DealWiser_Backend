import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  prices: [
    {
      name: String,
      price: Number
    }
  ],

  link: {
    type: String,
    required: true
  }

},
{ timestamps: true }
);


wishlistSchema.index(
{ user: 1, productId: 1 },
{ unique: true }
);

export default mongoose.model("Wishlist", wishlistSchema);