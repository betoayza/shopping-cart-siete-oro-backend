//codigo del servidor
import express from 'express';
const app = express(); //es el servidor
import morgan from 'morgan';
import router from './routes/routes_file.js';

const port_number = process.env.PORT || 4000;

app.use(express.json()); //para que el navegador muestre todo en formato json
// Middleware para parsear el cuerpo de las peticiones HTTP
app.use(express.urlencoded({
    extended: true
}))
//3) Routes
app.use(router); //ya empieza en 'src/'
//4) Static Files

//5) Starting server
app.listen(port_number, () => {
    console.log("Servidor corriendo en puerto 4000...");
});



