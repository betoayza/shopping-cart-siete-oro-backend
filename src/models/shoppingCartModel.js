import mongoose from "mongoose";

const { Schema } = mongoose;

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@sietedeoro.pmni0.mongodb.net/sietedeoro?retryWrites=true&w=majority`;

const conn = mongoose.createConnection(URI);

conn.once("open", () => {
  console.log("Connected to MongoDB");
});

const ShoppingCartSchema = new Schema(
  {
    code: { type: Number, required: true }, //code=userCode
    products: { type: Array, default: [] },
  },
  {
    collection: "shoppingCarts",
  }
);

const ShoppingCartModel = conn.model("ShoppingCartModel", ShoppingCartSchema);

export default ShoppingCartModel;
