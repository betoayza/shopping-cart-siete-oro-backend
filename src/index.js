import express from "express";
const app = express();
import morgan from "morgan";
import router from "./routes/routes_file.js";
import cors from "cors";
import multer from "multer";
import ProductModel from "./models/productModel.js";

const upload = multer({ dest: "src/uploads", limits: { fieldSize: 400* 400 } });
const port_number = process.env.PORT || 4000;

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

//cors support
app.use(cors({ origin: true }));

//Routes
app.use(router);

app.get("/favicon.ico", (req, res) => res.status(204));

//upload form with image

// app.use('/uploads', express.static('uploads'));

app.post("/api/admin/product/add", upload.single("image"), async (req, res) => {
  try {
    console.log(req.file); //image
    console.log(req.body); //rest inputs

    const { code } = req.body;
    //validate product
    let doc = await ProductModel.findOne({ code }).exec();
    //If not matches, add product
    if (doc) {
      res.json(null);
    } else {
      const newProduct = new ProductModel(req.body);
      await newProduct.save();
      res.json(doc);
    }
  } catch (error) {
    console.error(error);
  }
}); //Pediente

//5) Starting server
app.listen(port_number, () => {
  console.log("Servidor corriendo en puerto 4000...");
});
