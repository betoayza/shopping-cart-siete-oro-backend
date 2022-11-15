import cors from "cors";
import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
const app = express();
import morgan from "morgan";
import router from "./routes/routes_file.js";

const port_number = process.env.PORT || 4000;

//cors support
// app.use(cors({ origin: true }));
app.use(cors());

//Para que el navegador muestre todo en formato json
app.use(express.json());

//Middleware para parsear el cuerpo de las peticiones HTTP
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Morgan
app.use(morgan("dev"));

app.get("/", (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      name: "Server running on port 5000 :)",
    },
  });
});


//Routes
app.use(router);

//upload form with image

// app.use('/uploads', express.static('uploads'));

//5) Starting server
app.listen(port_number, () => {
  console.log("Servidor corriendo en puerto 4000...");
});
