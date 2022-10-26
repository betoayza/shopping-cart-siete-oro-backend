import mongoose from "mongoose";

const { Schema } = mongoose;

const URI =
  "mongodb+srv://beto123:superpassw123@sietedeoro.pmni0.mongodb.net/sietedeoro?retryWrites=true&w=majority";

const conn = mongoose.createConnection(URI);

conn.once("open", () => {
  console.log("Connected to MongoDB");
});

const productSchema = new Schema(
  {
    code: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: Buffer, required: true },
    toBuy: { type: Number, required: true },
    comments: { type: Array, default: [] },
    status: { type: String, required: true },
  },
  {
    collection: "products",
  }
);

const ProductModel = conn.model("ProductModel", productSchema); //'producto' es el nombre del modelo;

export default ProductModel;
