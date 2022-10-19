import { Router } from "express";
import ProductModel from "../models/productModel.js";
import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import ShoppingCartModel from "../models/shoppingCartModel.js";
import multer from "multer";
import { PaymentController } from "../../controllers/PaymentController.js";
import { PaymentService } from "../../services/PaymentService.js";
import moment from "moment";

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
        { name: { $regex: `^${term}`, $options: "i" } },
        { lastName: { $regex: `^${term}`, $options: "i" } },
        { email: { $regex: `^${term}`, $options: "i" } },
        { username: { $regex: `^${term}`, $options: "i" } },
        { address: { $regex: `^${term}`, $options: "i" } },
        { neighborhood: { $regex: `^${term}`, $options: "i" } },
        { phone: termNumber },
        { zip: { $regex: `^${term}`, $options: "i" } },
        { type: { $regex: `^${term}`, $options: "i" } },
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
        // { products: { $regex: `^${term}`, $options: "i" } },
        { amount: termNumber },
        { date: { $regex: `^${term}`, $options: "i" } },
        { status: { $regex: `^${term}`, $options: "i" } },
      ],
    });

    if (orders) res.json(orders);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

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
        { name: { $regex: `^${term}`, $options: "i" } },
        { description: { $regex: `^${term}`, $options: "i" } },
        { price: termNumber },
        { stock: termNumber },
        { status: { $regex: `^${term}`, $options: "i" } },
      ],
    });

    if (products) {
      res.json(products);
    } else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

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
          comments: [],
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
    let user = await UserModel.findOne({
      $and: [
        { $or: [{ email: data }, { username: data }] },
        { password },
        { status: "Activo" },
      ],
    }).exec();
    if (user) {
      res.json(user);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

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
}); //working

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
              name: { $regex: `^${term}`, $options: "i" },
            },
            { description: { $regex: `^${term}`, $options: "i" } },
          ],
        },
        { status: "Activo" },
      ],
    });
    if (products) res.json(products);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/api/product/code", async (req, res) => {
  try {
    console.log(req.query);
    const { productCode } = req.query;

    let product = await ProductModel.findOne({ code: productCode }).exec();

    if (product) res.json(product);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/api/products/get/list", async (req, res) => {
  try {
    console.log(req.query);
    const { itemsIDs } = req.query;
    let products = await ProductModel.find({
      code: { $in: itemsIDs },
    });
    console.log(products);
    if (products.length) res.json(products);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

//EDIT PROFILE
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

    let user = await UserModel.findOne({ code }).exec();
    let user2 = await UserModel.find({
      $and: [{ $or: [{ email }, { username }] }, { code: { $ne: code } }],
    });
    if (user && !user2.length) {
      user.name = name;
      user.lastName = lastName;
      user.email = email;
      user.username = username;
      user.password = password;
      user.address = address;
      user.neighborhood = neighborhood;
      user.phone = phone;
      user.zip = zip;

      user = await user.save();
      res.json(user);
    } else {
      res.json(null);
    }
  } catch (error) {
    res.json(null);
    console.error(error);
  }
}); //working

router.post("/api/user/comment/add", async (req, res) => {
  try {
    console.log(req.body);
    let { userCode, comment, productCode } = req.body;

    let user = await UserModel.findOne({ code: userCode }).exec();

    let product = await ProductModel.findOne({ code: productCode }).exec();

    if (product && user) {
      const username = user.username;
      comment = { username, comment, status: "Active" };
      product.comments.push(comment);
      product.save();
      res.json(true);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.delete("/api/user/comment/delete", async (req, res) => {
  try {
    const { index, productCode } = req.body;

    let deleteResult = await ProductModel.updateOne(
      { code: Number(productCode) },
      {
        $set: {
          [`comments.${index}.status`]: "Deleted",
        },
      }
    );

    let product = await ProductModel.findOne({
      code: Number(productCode),
    }).exec();

    console.log(deleteResult);

    if (deleteResult.modifiedCount === 1) res.json(true);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
});

//ORDERS
router.get("/api/user/orders", async (req, res) => {
  try {
    console.log(req.query);
    const { userCode } = req.query;
    console.log(userCode);

    let orders = await OrderModel.find({ code: userCode });
    if (orders.length) {
      res.json(orders);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.post("/api/user/orders/add", async (req, res) => {
  try {
    console.log(req.body);
    const { userCode, items, installments, totalAmount } = req.body;
    let user = await UserModel.findOne({ code: userCode }).exec();
    if (user) {
      console.log("Items: ", items);

      let products = await items.map((item) => {
        const updateStock = async (item) => {
          //updated product stock
          let product = await ProductModel.findOne({
            code: item.code,
          }).exec();

          product.stock -= item.toBuy;
          product.save();
        };
        updateStock(item);

        return item.code;
      });

      console.log("Products updated: ", products);

      let newOrder = new OrderModel({
        code: Date.now(),
        userCode,
        products,
        amount: totalAmount,
        date: moment(new Date()).format("DD/MM/YYYY"),
        status: "En curso",
      });
      newOrder = await newOrder.save();

      //return successful order
      res.json(newOrder);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.delete("/api/user/orders/delete", async (req, res) => {
  try {
    console.log(req.body);
    const { code, userCode } = req.body;
    let order = await OrderModel.findOne({
      $and: [{ code }, { userCode }, { status: "En curso" }],
    }).exec();
    if (order) {
      order.status = "Cancelado";
      order = order.save();
      //find all user orders
      let orders = await OrderModel.find({ userCode });
      res.json(orders);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/api/user/orders/all", async (req, res) => {
  try {
    console.log(req.query);
    const { userCode } = req.query;
    console.log(userCode);
    let orders = await OrderModel.find({ userCode });
    if (orders) {
      res.json(orders);
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

    let shoppingCart = await ShoppingCartModel.findOne({
      code: userCode,
    }).exec();

    if (shoppingCart) {
      res.json(shoppingCart);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/api/user/shopping-cart/check-item-added", async (req, res) => {
  try {
    console.log(req.query);
    const { userCode, prodCode } = req.query;

    let added = await ShoppingCartModel.findOne({
      $and: [
        {
          code: Number(userCode),
        },
        {
          products: { $elemMatch: { code: Number(prodCode) } },
        },
      ],
    }).exec();

    if (added) res.json(true);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

router.delete(`/api/user/shopping-cart/delete`, async (req, res) => {
  try {
    console.log(req.body);
    const { prodCode, userCode } = req.body;

    // let product = await ShoppingCartModel.findOne({
    //   $and: [{ code: userCode }, { $get: { products: { code: prodCode } } }],
    // }).exec();

    let added = await ShoppingCartModel.findOne({
      $and: [
        {
          code: Number(userCode),
        },
        {
          products: { $elemMatch: { code: Number(prodCode) } },
        },
      ],
    }).exec();

    if (added) {
      //make delete

      let updateResult = await ShoppingCartModel.updateOne(
        { code: Number(userCode) },
        { $pull: { products: { code: Number(prodCode) } } }
      );

      let shoppingCartUpdated = await ShoppingCartModel.findOne({
        code: userCode,
      }).exec();

      res.json(shoppingCartUpdated);
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
    let shoppingCart = await ShoppingCartModel.findOne({
      code: userCode,
    }).exec();
    if (shoppingCart) {
      console.log(shoppingCart);
      shoppingCart.products = [];
      shoppingCart = shoppingCart.save();
      // await ShoppingCartModel.updateOne(
      //   { code: userCode },
      //   { $pull: { products: {} } }
      // );
      //returns shopping cart cleaned
      shoppingCart = await ShoppingCartModel.findOne({ code: userCode }).exec();
      res.json(shoppingCart);
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
    let shoppingCart = await ShoppingCartModel.findOne({
      code: userCode,
    }).exec();
    if (shoppingCart && shoppingCart.products.length) {
      //shopping cart has 1+ products
      let shoppingCart = await ShoppingCartModel.updateOne(
        { code: userCode },
        { $set: { [`products.${itemIndex}.toBuy`]: toBuy } }
      );
      console.log(shoppingCart);
      res.json(shoppingCart);
    } else res.json(shoppingCart); //response with empty shopping cart
  } catch (error) {
    console.error(error);
  }
}); //working

router.put("/api/user/shopping-cart/add", async (req, res) => {
  try {
    console.log(req.body);
    const { productCode, userCode } = req.body;

    let shoppingCart = await ShoppingCartModel.findOne({
      code: Number(userCode),
    }).exec();

    let product = await ProductModel.findOne({
      $and: [{ code: Number(productCode) }, { status: "Activo" }],
    }).exec();

    let added = await ShoppingCartModel.findOne({
      $and: [
        {
          code: Number(userCode),
        },
        {
          products: { $elemMatch: { code: Number(productCode) } },
        },
      ],
    }).exec();

    if (shoppingCart && product && !added) {
      shoppingCart.products.push(product);
      shoppingCart = shoppingCart.save();
      res.json(true);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

//--------------------------

//MERCADO PAGO
const paymentInstance = new PaymentController(new PaymentService());

router.post("/api/payment", (req, res) => {
  try {
    paymentInstance.getPaymentLink(req, res);
  } catch (error) {
    console.error(error);
  }
}); //working

export default router;
