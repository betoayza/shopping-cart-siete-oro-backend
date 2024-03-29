import express from "express";
import router from "./routes/routes_file.js";
import cors from "cors";

const app = express();
const port_number = process.env.PORT || 4000;

app.use(cors()); // allows any origin
//Para que el navegador muestre todo en formato json
app.use(express.json());

//Middleware to parse POST forms to req.body
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Routes
app.use(router);

app.get("/favicon.ico", (req, res) => res.status(204));

// 5) Starting server
app.listen(port_number, () => {
  console.log("Server running...");
});
