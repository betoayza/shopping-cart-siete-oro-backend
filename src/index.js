import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
const app = express();
import morgan from "morgan";
import router from "./routes/routes_file.js";
import cors from "cors";

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


//Routes
app.use(router);

//upload form with image

// app.use('/uploads', express.static('uploads'));

//5) Starting server
// app.listen(port_number, () => {
//   console.log("Servidor corriendo en puerto 4000...");
// });
