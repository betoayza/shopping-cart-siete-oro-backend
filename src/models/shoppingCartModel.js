import mongoose from "mongoose";

const { Schema } = mongoose;

const URI =
  "mongodb+srv://beto123:superpassw123@car-workshop.uwvuy.mongodb.net/car-workshop?retryWrites=true&w=majority";

const conn = mongoose.createConnection(URI);

conn.once("open", () => {
  console.log("Connected to MongoDB");
});

const ShoppingCartSchema = new Schema(
  {
    code: { type: Number, required: true },
    userCode: { type: Number, required: true },
    products: { type: Array, default: [], required: true },
  },
  {
    collection: "shoppingCarts",
  }
);

const ShoppingCartModel = conn.model("ShoppingCartModel", ShoppingCartSchema);

export default ShoppingCartModel;
