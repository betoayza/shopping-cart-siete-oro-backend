//RUTAS NECESARIAS PARA TRABAJAR CON REACT

import { Router } from "express";
const router = Router(); //objeto en el cual ingresaré las rutas
//models
import Product from "../models/product.js";
import Order from "../models/order.js";
import User from "../models/user.js";

//ruta principal: mostrar mensaje de exito
router.get("/", async (req, res) => {
  try {
    res.send("Api is running!...");
  } catch (error) {
    res.json("Un error ha ocurrido!");
    console.log("El error es: ", error);
  }
});

//register a product
router.post("/admin/register/product", async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    //recorrer array de productos hardcodeados
    const producto = new Product({ name, description, price, stock });
    await producto.save(); //SEGUIR EN ESTE PUNTO
    //mostrar producto nuevo
    res.json(producto);
    console.log("Alta exitosa!: ", producto);
    //res.render('home', { listaProductos });
  } catch (error) {
    res.json("Ha ocurrido un error!: ", error);
    console.error("El error es: ", error);
  }
});

router.get("/products-founded", async (req, res) => {
  try {
    console.log(req.query);
    const article = req.query;
    console.log("asd");
    //buscar la lista de productos incluodo el nombre del articulo
    const coincidences = await Product.find(article); //debe incluir en el name, son ser igual
    console.log(coincidences);
    res.json(coincidences);
  } catch (error) {
    //res.json('No hay productos disponibles!');
    console.error("El error es: ", error);
  }
});

//Browser consults all products
//ready
router.get("/all-products", async (req, res) => {
  try {
    //buscar la lista de productos
    const listaProductos = await Product.find();
    res.json(listaProductos);
    console.log(listaProductos);
  } catch (error) {
    res.json("No hay productos disponibles!");
    console.error("El error es: ", error);
  }
});

//Ruquest for admin
//ready
router.get("/admin/search/product-by-id", async (req, res) => {
  try {
    const product = await Product.findById(req.query);
    console.log(product);
    res.send("Producto Encontrado!: \n" + product);
  } catch (error) {
    res.send("No hubo coincidencia :(");
    console.log("Es error es: ", error);
  }
});

router.get("/admin/search/all-users", async (req, res) => {
  try {
    const user = await User.findById();
    console.log(user);
    res.send("Lista usuarios!: \n" + user);
  } catch (error) {
    res.send("No hubo coincidencia :(");
    console.log("Es error es: ", error);
  }
});

router.get("/admin/search/all-orders", async (req, res) => {
  try {
    const order = await Order.findById();
    console.log(order);
    res.send("Lista Pedidos totales!: \n" + order);
  } catch (error) {
    res.send("No hubo coincidencia :(");
    console.log("Es error es: ", error);
  }
});

router.get("/admin/search/recieved-orders", async (req, res) => {
  try {
    const r_order = await Order.find({ status: Entregado });
    console.log(r_order);
    res.send("Lista pedidos entregados!: \n" + r_order);
  } catch (error) {
    res.send("No hubo coincidencia :(");
    console.log("Es error es: ", error);
  }
});

//modify a product by ID
//ready
router.put("/admin/modif-product", async (req, res) => {
  try {
    const { _id, name, description, price, stock } = req.body;
    const modifiedProduct = new Product({ name, description, price, stock });
    const result = await Producto.findByIdAndUpdate(_id, modifiedProduct);
    res.json({ status: "Modificación existosa!", newDocument: result }); //repondo al navegador en formato json
  } catch (error) {
    res.json("Producto no encontrado!");
    console.error("El error es: ", error);
  }
});

//Delete a product
//ready
router.delete("/admin/delete/product", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.query);
    res.json({ status: "Baja exitosa!" });
  } catch (error) {
    res.json("No hubo coincidencia");
    console.error("El error es: ", error);
  }
});

router.delete("/admin/delete/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.query);
    res.json({ status: "Baja exitosa!" });
  } catch (error) {
    res.json("No hubo coincidencia");
    console.error("El error es: ", error);
  }
});

//ruta por defecto
router.get("*", (req, res) => {
  try {
    res.json({ status: "error 404" });
  } catch (error) {
    res.json("Un error ha ocurrido!");
    console.log("El error es: ", error);
  }
});

export default router;
