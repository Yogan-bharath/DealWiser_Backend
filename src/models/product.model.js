import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  stores: [storeSchema],

  bestStore: {
    name: String,
    price: Number,
    link: String,
  },

  isBestDeal: {
    type: Boolean,
    default: false,
  },
},
{ timestamps: true });

productSchema.index({ name: "text" });

const productModel = mongoose.model("products", productSchema);

export default productModel;