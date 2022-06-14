import express from "express";
const app = express(); //es el servidor
import morgan from "morgan";
import router from "./routes/routes_file.js";
import fileUpload from "express-fileupload";

const port_number = process.env.PORT || 4000;

//Para poder subir archivos
//app.use(fileUpload());

//Para que el navegador muestre todo en formato json
app.use(express.json());
//Middleware para parsear el cuerpo de las peticiones HTTP
app.use(
  express.urlencoded({
    extended: true,
  })
);
//Rutas
app.use(router);

//5) Starting server
app.listen(port_number, () => {
  console.log("Servidor corriendo en puerto 4000...");
});
