import { Router } from "express";
import ProductModel from "../models/productModel.js";
import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import ShoppingCartModel from "../models/shoppingCartModel.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

const router = Router();

router.get("/api", (req, res) => {
  res.send("Server working on port 4000!");
});

//GENERIC ACTIONS
router.get("/api/products/get", async (req, res) => {
  try {
    console.log(req.query);
    const { name } = req.query;
    let doc = await ProductModel.find({
      $or: [
        {
          name: { $regex: `${name}`, $options: "i" },
        },
        { description: { $regex: `${name}`, $options: "i" } },
      ],
    });
    if (doc.length) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/api/products/all", async (req, res) => {
  try {
    let doc = await ProductModel.find({});
    if (doc.length) {
      console.log(doc);
      res.json(doc);
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
    if (doc.length) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.delete("/admin/users/delete/:code", async (req, res) => {
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

router.get("/admin/search/orders/all", async (req, res) => {
  try {
    console.log(req.query);
    let doc = await OrderModel.find({});
    if (doc.length) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/admin/search/order/:code", async (req, res) => {
  try {
    console.log(req.params.code);
    const code = req.params.code;
    let doc = await OrderModel.findOne({ code }).exec();
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

router.get("/admin/search/orders/received", async (req, res) => {
  try {
    console.log(req.query);
    let doc = await OrderModel.find({ status: "Entregado" });
    if (doc.length) {
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
    if (doc.length) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

//Working for Add & Modify products
router.post(
  "/api/admin/product/add",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log(req.file); //image
      console.log(req.body); //rest inputs

      const { code } = req.body;
      //validate product
      let doc = await ProductModel.findOne({ code }).exec();
      if (doc) {
        res.json(null);
      } else {
        //If not matches, add product
        const { name, description, price, stock, status } = req.body;
        //const {destination, originalname}=req.file;

        const newProduct = new ProductModel({
          code,
          name,
          description,
          price,
          stock,
          image: req.file.buffer,
          status,
        });
        doc = await newProduct.save();
        res.json(doc);
      }
    } catch (error) {
      console.error(error);
      res.json(null);
    }
  }
); //working

router.put(
  "/api/admin/product/modify",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log(req.file); //image
      console.log(req.body); //rest inputs

      const { code } = req.body;
      //validate product
      let doc = await ProductModel.findOne({ code }).exec();
      if (doc) {
        const { name, description, price, stock } = req.body;
        doc.name=name;
        doc.description=description;
        doc.price=price;
        doc.stock=stock;
        doc.image=req.file.buffer; 

        doc = await doc.save();
        res.json(doc);
      } else {        
        res.json(null);
      }
    } catch (error) {
      console.error(error);
      res.json(null);
    }
  }
);

router.get("/api/admin/products/search/code", async (req, res) => {
  try {
    console.log(req.query);
    const { code } = req.query;
    let doc = await ProductModel.findOne({
      $and: [{ code }, { status: "Activo" }],
    }).exec();
    if (doc) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //pendiente

router.delete("/api/admin/products/delete", async (req, res) => {
  try {
    console.log(req.body);
    const { code } = req.body;
    let doc = await ProductModel.findOne({ code }).exec();
    if (doc) {
      console.log(doc);
      doc.status = "Dado de baja";
      doc = await doc.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/api/admin/product/search", async (req, res) => {
  try {
    console.log(req.query);
    const { code } = req.query;
    let doc = await ProductModel.findOne({
      $and: [{ code }, { status: "Activo" }],
    }).exec();
    if (doc) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

//LOGIN & SIGNUP (working)
router.get("/api/login", async (req, res) => {
  try {
    console.log(req.query);
    const { data, password } = req.query;
    let doc = await UserModel.findOne({
      $and: [{ $or: [{ email: data }, { username: data }] }, { password }],
    }).exec();
    if (doc) {
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.post("/api/signup", async (req, res) => {
  try {
    console.log(req.body);
    const { email, username } = req.body;
    //if there are not users, create admin
    let doc = await UserModel.find({});
    if (!doc.length) {
      const dataUser = { ...req.body };
      dataUser.type = "Admin";
      const newUser = new UserModel(dataUser);
      doc = await newUser.save();
      res.json(doc);
      //if there are users, create an stardard user
    } else {
      //validate by email & username
      doc = await UserModel.findOne({ $or: [{ email }, { username }] }).exec();
      //if user exists do not register
      if (doc) {
        res.json(null);
      } else {
        //otherwise, register user
        const dataUser = { ...req.body };
        const newUser = new UserModel(dataUser);
        doc = await newUser.save();
        //create user shopping cart
        const newShoppingCart = new ShoppingCartModel({
          code: doc.code,
          products: [],
        }); //shopping cart code is user code
        let doc2 = await newShoppingCart.save();
        console.log(doc2);
        //just response with new user
        res.json(doc);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//USER ROUTES
router.put("/api/user/profile/edit", async (req, res) => {
  try {
    console.log(req.body);
    const {
      code,
      name,
      lastName,
      email,
      username,
      password,
      address,
      neighborhood,
      phone,
      zip,
    } = req.body;

    let doc = await UserModel.findOne({ code }).exec();
    if (doc) {
      doc.name = name;
      doc.lastName = lastName;
      doc.email = email;
      doc.username = username;
      doc.password = password;
      doc.address = address;
      doc.neighborhood = neighborhood;
      doc.phone = phone;
      doc.zip = zip;

      doc = await doc.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/api/user/orders/code", async (req, res) => {
  try {
    console.log(req.query);
    const { code } = req.query;
    let doc = await OrderModel.findOne({ code }).exec();
    if (doc) {
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/api/user/shopping-cart", async (req, res) => {
  try {
    console.log(req.query);
    const { code } = req.query;
    let doc = await ShoppingCartModel.findOne({ code }).exec();
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

router.get("/api/user/orders/all", async (req, res) => {
  try {
    let doc = await OrderModel.find({});
    if (doc.length) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
});

export default router;
