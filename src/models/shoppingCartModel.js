import mongoose from "mongoose";

const { Schema } = mongoose;

const URI =
  "mongodb+srv://beto123:superpassw123@sietedeoro.pmni0.mongodb.net/sietedeoro?retryWrites=true&w=majority";

const conn = mongoose.createConnection(URI);

conn.once("open", () => {
  console.log("Connected to MongoDB");
});

const ShoppingCartSchema = new Schema(
  {
    code: { type: Number, required: true },   
    products: { type: Array, default: [] },
  },
  {
    collection: "shoppingCarts",
  }
);

const ShoppingCartModel = conn.model("ShoppingCartModel", ShoppingCartSchema);

export default ShoppingCartModel;
