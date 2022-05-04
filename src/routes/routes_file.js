import { Router } from "express";
import Product from "../models/product.js";
import Order from "../models/order.js";
import User from "../models/userModel.js";
import UserModel from "../models/userModel.js";

const router = Router();
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
    const producto = new Product({ name, description, price, stock }); //************ */
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
    //console.log(req.query);
    const product = req.query.name;
    console.log("Buscando ", product, "...");
    //buscar la lista de productos incluodo el nombre del articulo
    const coincidences = await Product.find({ name: { $regex: product } }); //debe incluir en el name, son ser igual
    console.log("Resultados encontrados: ", coincidences);
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

router.post("/login", async (req, res) => {
  const { email, passw } = req.body;
  //const user = new UserModel(req.query);
  const doc = await UserModel.findOne({$and: [{email}, {passw}]}).exec();
  console.log(doc);
  res.json(doc);
});

router.post("/signup", async (req, res) => {
  const {
    name,
    lastName,
    email,
    passw,
    address,
    neighborhood,
    phone,
    zip,
    status,
  } = req.body;
  const dataUser = {
    name,
    lastName,
    email,
    passw,
    address,
    neighborhood,
    phone,
    zip,
    status,
  };
  console.log(name);
  const newUser = new User(dataUser);
  const result = await newUser.save();
  res.json(result);
});

//********* */

router.post("/user/profile/edit", async (req, res) => {
  const {
    name,
    lastName,
    email,
    passw,
    address,
    neighborhood,
    phone,
    zip,
    status,
  } = req.body;
  console.log(name);
  const userData = {
    name,
    lastName,
    email,
    passw,
    address,
    neighborhood,
    phone,
    zip,
    status,
  };
  const newUser = new UserModel(userData);
  const doc = await newUser.findOne({ email }).exec();
  doc = { ...newUser };
  const doc2 = await doc.save();
  console.log("Documento editado existosamente: ", doc2);
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
