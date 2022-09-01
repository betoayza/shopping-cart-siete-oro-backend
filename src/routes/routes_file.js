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
//---------------ADMIN ROUTES----------------------

//USERS
router.get("/api/admin/users/all", async (req, res) => {
  try {
    console.log(req.query);
    let doc = await UserModel.find({});
    if (doc.length) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/api/admin/users/search/one", async (req, res) => {
  try {
    console.log(req.query);
    const { code } = req.query;
    let doc = await UserModel.findOne({ code }).exec();
    if (doc) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
    res.json(null);
  }
}); //working

router.get("/api/admin/users/search", async (req, res) => {
  try {
    console.log(req.query);
    const { term } = req.query;
    let termNumber = null;
    isNaN(Number(term)) ? term : (termNumber = Number(term));

    let users = await UserModel.find({
      $or: [
        { code: termNumber },
        { name: { $regex: `${term}`, $options: "i" } },
        { lastName: { $regex: `${term}`, $options: "i" } },
        { email: { $regex: `${term}`, $options: "i" } },
        { username: { $regex: `${term}`, $options: "i" } },
        { address: { $regex: `${term}`, $options: "i" } },
        { neighborhood: { $regex: `${term}`, $options: "i" } },
        { phone: termNumber },
        { zip: { $regex: `${term}`, $options: "i" } },
        { type: { $regex: `${term}`, $options: "i" } },
        { status: { $regex: `^${term}`, $options: "i" } },
      ],
    });

    if (users) res.json(users);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

router.delete("/api/admin/users/delete", async (req, res) => {
  try {
    console.log(req.body);
    const { code } = req.body;
    let doc = await UserModel.findOne({
      $and: [{ code }, { status: "Activo" }],
    }).exec();
    if (doc) {
      console.log(doc);
      doc.status = "Banneado";
      doc = await doc.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.put("/api/admin/users/activate", async (req, res) => {
  try {
    console.log(req.body);
    const { code } = req.body;
    let doc = await UserModel.findOne({
      $and: [{ code }, { status: "Banneado" }],
    }).exec();
    if (doc) {
      doc.status = "Activo";
      doc = await doc.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

//ORDERS

router.get("/api/admin/orders/all", async (req, res) => {
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
}); //working

router.get("/api/admin/orders/code", async (req, res) => {
  try {
    console.log(req.query);
    const { code } = req.query;
    let doc = await OrderModel.findOne({
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

router.get("/api/admin/orders/search", async (req, res) => {
  try {
    console.log(req.query);
    const { term } = req.query;
    let termNumber = null;
    isNaN(Number(term)) ? term : (termNumber = Number(term));

    let orders = await OrderModel.find({
      $or: [
        { code: termNumber },
        { userCode: termNumber },
        { products: { $regex: `${term}`, $options: "i" } },
        { amount: termNumber },
        { date: { $regex: `${term}`, $options: "i" } },
        { status: { $regex: `^${term}`, $options: "i" } },
      ],
    });

    if (orders) res.json(orders);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
});

//PRODUCTS
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
}); //working

router.get("/api/admin/products/search", async (req, res) => {
  try {
    console.log(req.query);
    const { term } = req.query;
    let termNumber = null;
    isNaN(Number(term)) ? term : (termNumber = Number(term));

    let products = await ProductModel.find({
      $or: [
        { code: termNumber },
        { name: { $regex: `${term}`, $options: "i" } },
        { description: { $regex: `${term}`, $options: "i" } },
        { price: termNumber },
        { stock: termNumber },
        { status: { $regex: `^${term}`, $options: "i" } },
      ],
    });

    if (products.length) {
      res.json(products);
    } else res.json(null);
  } catch (error) {
    console.error(error);
  }
});

router.post(
  "/api/admin/product/add",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log(req.file); //image
      console.log(req.body); //rest inputs

      const { code, name, description, status } = req.body;
      //validate product
      let doc = await ProductModel.findOne({
        $and: [
          {
            $or: [{ code }, { name }],
          },
          { description },
          { status },
        ],
      }).exec();
      if (doc) {
        res.json(null);
      } else {
        //If not matches, add product
        const { name, description, price, stock, toBuy, status } = req.body;
        //const {destination, originalname}=req.file;

        const newProduct = new ProductModel({
          code,
          name,
          description,
          price,
          stock,
          image: req.file.buffer,
          toBuy,
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

router.put("/api/admin/products/activate", async (req, res) => {
  try {
    console.log(req.body);
    const { code } = req.body;
    let doc = await ProductModel.findOne({
      $and: [{ code }, { status: "Dado de baja" }],
    }).exec();
    if (doc) {
      doc.status = "Activo";
      doc = await doc.save();
      res.json(doc);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

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
        doc.name = name;
        doc.description = description;
        doc.price = price;
        doc.stock = stock;
        doc.image = req.file.buffer;

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
); //working

router.delete("/api/admin/products/delete", async (req, res) => {
  try {
    console.log(req.body);
    const { code } = req.body;
    let doc = await ProductModel.findOne({
      $and: [{ code }, { status: "Activo" }],
    }).exec();
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

router.get("/api/admin/products/search/code", async (req, res) => {
  try {
    console.log(req.query);
    const { code } = req.query;
    let doc = await ProductModel.findOne({
      code,
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

//-----------------LOGIN & SIGNUP-----------------------

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

//-------------------USER ROUTES-------------------------------

//PRODUCTS
router.get("/api/products/get", async (req, res) => {
  try {
    console.log(req.query);
    const { term } = req.query;
    let products = await ProductModel.find({
      $and: [
        {
          $or: [
            {
              name: { $regex: `${term}`, $options: "i" },
            },
            { description: { $regex: `${term}`, $options: "i" } },
          ],
        },
        { status: "Activo" },
      ],
    });
    if (products.length) res.json(products);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
});

//PROFILE
router.put("/api/user/profile/modify", async (req, res) => {
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
    res.json(null);
    console.error(error);
  }
});

//ORDERS
router.get("/api/user/orders/code", async (req, res) => {
  try {
    console.log(req.query);
    const { orderCode, userCode } = req.query;
    console.log(orderCode);
    console.log(userCode);

    let doc = await OrderModel.findOne({
      $and: [{ code: orderCode }, { userCode }],
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

router.post("/api/user/orders/add", async (req, res) => {
  try {
    // console.log(req.body);
    // const {products, userCode}=req.body;
    // const newOrder = new OrderModel({code: Date.now(), userCode, products, amount, date, status: "Active"});
    // let doc= await OrderModel.save
  } catch (error) {
    console.error(error);
  }
});

router.delete("/api/user/orders/delete", async (req, res) => {
  try {
    console.log(req.body);
    const { code, userCode } = req.body;
    let doc = await OrderModel.findOne({
      $and: [{ code }, { userCode }, { status: "Activo" }],
    }).exec();
    if (doc) {
      console.log(doc);
      doc.status = "Dado de baja";
      doc = doc.save();
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
    console.log(req.query);
    const { code } = req.query;
    console.log(code);
    let doc = await OrderModel.find({ userCode: code });
    if (doc.length) {
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

//SHOPPING CART
router.get("/api/user/shopping-cart", async (req, res) => {
  try {
    console.log(req.query);
    const { userCode } = req.query;
    let doc = await ShoppingCartModel.findOne({ code: userCode }).exec();
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

router.delete(`/api/user/shopping-cart/delete`, async (req, res) => {
  try {
    console.log(req.body);
    const { prodCode, userCode } = req.body;
    let doc = await ShoppingCartModel.findOne({ code: userCode }).exec(); //validate shopping cart
    let doc2 = await ProductModel.findOne({ code: prodCode }).exec(); //validate product
    if (doc && doc2) {
      //maked delete
      doc = await ShoppingCartModel.updateOne(
        { code: userCode },
        { $pull: { products: { code: prodCode } } }
      );
      console.log(doc);
      //returns shopping cart updated
      doc = await ShoppingCartModel.findOne({ code: userCode }).exec();
      console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.delete("/api/user/shopping-cart/delete/all", async (req, res) => {
  try {
    console.log(req.body);
    const { userCode } = req.body;
    let doc = await ShoppingCartModel.findOne({ code: userCode }).exec();
    if (doc) {
      console.log(doc);
      await ShoppingCartModel.updateOne(
        { code: userCode },
        { $pull: { products: {} } }
      );
      //returns shopping cart updated
      doc = await ShoppingCartModel.findOne({ code: userCode }).exec();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.put("/api/user/shopping-cart/update/toBuy", async (req, res) => {
  try {
    console.log("asd: ", req.body);
    const { userCode, toBuy, itemIndex } = req.body;
    let doc = await ShoppingCartModel.updateOne(
      { code: userCode },
      { $set: { [`products.${itemIndex}.toBuy`]: toBuy } }
    );
    console.log(doc);
    res.json(doc);
  } catch (error) {
    console.error(error);
  }
});

router.put("/api/user/shopping-cart/add", async (req, res) => {
  try {
    console.log(req.body);
    const { productCode, userCode } = req.body;

    let doc = await ShoppingCartModel.findOne({ code: userCode }).exec();
    let doc2 = await ProductModel.findOne({
      $and: [{ code: productCode }, { status: "Activo" }],
    }).exec();
    let doc3 = await ShoppingCartModel.findOne({
      products: { $elemMatch: { code: productCode } },
    }).exec();

    if (doc && doc2 && !doc3) {
      doc.products.push(doc2);
      doc = doc.save();
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

export default router;
