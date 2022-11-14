import mongoose from "mongoose";

const { Schema } = mongoose;

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@sietedeoro.pmni0.mongodb.net/sietedeoro?retryWrites=true&w=majority`;

const conn = mongoose.createConnection(URI);

conn.once("open", () => {
  console.log("Connected to MongoDB");
});

const orderSchema = new Schema(
  {
    code: { type: Number, required: true },
    userCode: { type: Number, required: true },
    products: { type: Array, default: [] },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    collection: "orders",
  }
);

const Order = conn.model("Order", orderSchema);

export default Order;
