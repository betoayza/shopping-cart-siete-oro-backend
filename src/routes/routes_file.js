import { Router } from "express";
import ProductModel from "../models/productModel.js";
import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import ShoppingCartModel from "../ShoppingCartModel";
// import multer from 'multer';
// const upload = multer({ dest: './public/data/uploads/' })

const router = Router();

//----------PRODUCTS--------------------------

router.get("/products/find", async (req, res) => {
  try {
    const { name } = req.query;
    console.log(req.query);
    let doc = await ProductModel.find({ name });
    if (doc.length > 0) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/products/all", async (req, res) => {
  try {
    let doc = await ProductModel.find({});
    if (doc.length > 0) {
      console.log(doc);
      res.json(listaProductos);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

//ADMIN ROUTES

router.get("/admin/search/users/all", async (req, res) => {
  try {
    console.log(req.query);
    let doc = await User.find({});
    if (doc.length > 0) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.delete("/admin/user/delete/:code", async (req, res) => {
  try {
    console.log(req.params.code);
    const code = req.params.code;
    let doc = await UserModel.findOne({ code }).exec();
    if (doc) {
      console.log(doc);
      doc.status = "Inactive";
      doc = await doc.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/admin/user/search/:code", async (req, res)=>{
  try {
    console.log(req.params.code);
    const code=req.params.code;
    let doc=await UserModel.findOne({ code }).exec();
    if(doc){
      console.log(doc);
      res.json(doc);
    }else{
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/admin/search/orders/all", async (req, res) => {
  try {
    console.log(req.query);
    let doc = await OrderModel.find({});
    if (doc.length > 0) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/admin/search/order/:code", async (req, res)=>{
  try {
    console.log(req.params.code);
    const code=req.params.code;
    let doc=await OrderModel.findOne({ code }).exec();
    if(doc){
      console.log(doc);
      res.json(doc);
    }else{
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/admin/search/orders/recieved", async (req, res) => {
  try {
    console.log(req.query);
    let doc = await OrderModel.find({ status: "Entregado" });
    if (doc.length > 0) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/admin/search/orders/incoming", async (req, res) => {
  try {
    console.log(req.query);
    let doc = await OrderModel.find({ status: "En camino" });
    if (doc.length > 0) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

//Pediente
router.post("/admin/product/add", async (req, res) => {
  // upload.single('image')
  try {
    console.log(req.body);
    console.log("File: ", req.file);
    console.log(req.body);
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
});

router.put("/admin/product/modify", async (req, res) => {
  try {
    console.log(req.body);
    const { code, name, description, price, stock, image } = req.body;
    let doc = await ProductModel.findOne({ code }).exec();
    if (doc) {
      console.log(doc);
      doc.name = name;
      doc.description = description;
      doc.price = price;
      doc.stock = stock;
      doc.image = image;
      doc = await doc.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.delete("/admin/product/delete/:code", async (req, res) => {
  try {
    console.log(req.params.code);
    const code = req.params.code;
    let doc = await ProductModel.findOne({ code }).exec();
    if (doc) {
      console.log(doc);
      doc.status = "Inactive";
      let doc = await doc.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/admin/product/search/:code", async (req, res) => {
  try {
    console.log(req.params.ProductModel);
    const code = req.params.code;
    let doc = await ProductModel.findOne({ code }).exec();
    if (doc) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    let doc = await ClientModel.findOne({ email }).exec();    
    if (doc) {
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;
    //if there are not users, create admin
    let doc = await ClientModel.find({});        
    if (!doc.length) {
      const dataUser = { ...req.body };      
      dataUser.type = "Admin";
      const newUser = new UserModel(dataUser);
      doc = await newUser.save();
      res.json(doc);
      //if there are users, create an stardard user
    } else {
      //validate by email & username
      doc = await ClientModel.findOne({ email }).exec();      
      //if user exists do not register
      if (doc) {
        res.json(null);
      } else {//otherwise, register
        const newUser = new User(dataUser);
        doc = await newUser.save();
        res.json(doc);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/user/profile/edit", async (req, res) => {
  try {
    console.log(req.body.form);
    const {
      code,
      name,
      lastName,
      email,      
      password,
      address,
      neighborhood,
      phone,
      zip,
    } = req.body.form;    

    let doc = await ClientModel.findOne({ code }).exec();
    if(doc){
      doc.name = name;
      doc.lastName = lastName;
      doc.email = email;
      doc.password = password;
      doc.address = address;
      doc.neighborhood = neighborhood;
      doc.phone = phone;
      doc.zip = zip;
  
      doc = await doc.save();    
      res.json(doc);
    }else{
      res.json(null);
    }
  } catch (error) {
    console.error("El error es: ", error);
  }
});

//USER ROUTES
router.get("/user/orders", (req,res)=>{
  try {
    const {code}=req.query;
    let doc=await OrderModel.find({code});
    if(!doc.length){
      res.json(null);
    }else{
      res.json(doc);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get('user/shoppingcart', async (req, res)=>{
try {
  console.log(req.query);
  const {code}=req.query;
  let doc=await ShoppingCartModel.findOne({userCode: code}).exec();
  if(doc){
    console.log(doc);
    res.json(doc);
  }else{
    res.json(null);
  }
} catch (error) {
  console.log(error);
}
});

// router.get('/user/shoppingcart', async (req, res)=>{
//   try {
//     let doc=await 
//   } catch (error) {
    
//   }
// });

//default route
router.get("*", (req, res) => {
  try {
    res.json({ status: "Error 404" });
  } catch (error) {
    console.error(error);
  }
});

export default router;
