import { Router } from "express";
import ProductModel from "../models/productModel.js";
import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import ShoppingCartModel from "../models/shoppingCartModel.js";
import multer from "multer";
import { PaymentController } from "../../controllers/PaymentController.js";
import { PaymentService } from "../../services/PaymentService.js";
import moment from "moment";
import mongoose from "mongoose";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

const router = Router();

router.get("/", (req, res) => {
  res.send("Server working!");
});

//---------------ADMIN ROUTES----------------------

//USERS
router.get("/admin/users/all", async (req, res) => {
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

router.get("/admin/users/search/one", async (req, res) => {
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

router.get("/admin/users/search", async (req, res) => {
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

router.delete("/admin/users/delete", async (req, res) => {
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

router.put("/admin/users/activate", async (req, res) => {
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
router.get("/admin/orders/all", async (req, res) => {
  try {
    let doc = await OrderModel.find({});
    if (doc.length) {
      //console.log(doc);
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/admin/orders/code", async (req, res) => {
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

router.get("/admin/orders/search", async (req, res) => {
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

router.put("/admin/orders/change-state", async (req, res) => {
  try {
    console.log(req.body);
    const { code, newState } = req.body;

    let order = await OrderModel.findOneAndUpdate(
      { code: Number(code) },
      { status: newState }
    );

    order ? res.json(order) : res.json(null);
  } catch (error) {
    console.error(error);
  }
});

//PRODUCTS
router.get("/products/all", async (req, res) => {
  try {
    let products = await ProductModel.find({});
    if (products.length) {
      //console.log(doc);
      res.json(products);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/admin/products/search", async (req, res) => {
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

router.post("/admin/product/add", upload.single("image"), async (req, res) => {
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
        isInCart: false,
      });
      doc = await newProduct.save();
      res.json(doc);
    }
  } catch (error) {
    console.error(error);
    res.json(null);
  }
}); //working

router.put("/admin/products/activate", async (req, res) => {
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
  "/admin/product/modify",
  upload.single("image"),
  async (req, res) => {
    try {
      //console.log(req.file); //image
      //console.log(req.body); //rest inputs

      const { code, name, description, price, stock } = req.body;
      //validate product
      let productUpdated = await ProductModel.findOneAndUpdate(
        { code },
        { name, description, price, stock }
      );
      if (productUpdated) {
        res.json(productUpdated);
      } else {
        res.json(null);
      }
    } catch (error) {
      console.error(error);
      res.json(null);
    }
  }
); //working

router.delete("/admin/products/delete", async (req, res) => {
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

router.get("/admin/products/search/code", async (req, res) => {
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
router.get("/login", async (req, res) => {
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

router.post("/signup", async (req, res) => {
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

//-------------------NOT USER ---------------------------
router.get("/products/active/all", async (req, res) => {
  try {
    let products = await ProductModel.find({ status: "Activo" });
    res.json(products);
  } catch (error) {
    console.error(error);
  }
});

//-------------------USER ROUTES-------------------------------

//GET DATA USER

router.get("/user/get", async (req, res) => {
  try {
    console.log(req.query);
    const { userCode } = req.query;

    let user = await UserModel.findOne({ code: userCode }).exec();

    if (user) res.json(user);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
});

//PRODUCTS
router.get("/products/get", async (req, res) => {
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

router.get("/product/code", async (req, res) => {
  try {
    //console.log(req.query);
    const { productCode } = req.query;

    let product = await ProductModel.findOne({ code: productCode }).exec();

    if (product) res.json(product);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/products/get/list", async (req, res) => {
  try {
    //console.log(req.query);
    let { itemsIDs } = req.query;
    itemsIDs = itemsIDs.map((id) => {
      return mongoose.Types.ObjectId(id);
    });

    let products = await ProductModel.find({
      _id: { $in: itemsIDs },
    });
    console.log(products);

    if (products.length) res.json(products);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

//EDIT PROFILE
router.put("/user/profile/modify", async (req, res) => {
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

router.post("/user/comment/add", async (req, res) => {
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

router.delete("/user/comment/delete", async (req, res) => {
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

    console.log(deleteResult);

    if (deleteResult.modifiedCount === 1) res.json(true);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
});

//ORDERS
router.get("/user/orders", async (req, res) => {
  try {
    //console.log(req.query);
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

router.post("/user/orders/add", async (req, res) => {
  try {
    //console.log(req.body);
    const { userCode, items, installments, totalAmount } = req.body;

    let user = await UserModel.findOne({ code: userCode }).exec();

    if (user) {
      console.log("Items: ", items);

      let products = await items.map((item) => {
        const updateStock = async (item) => {
          //updated product stock
          let product = await ProductModel.findOne({
            _id: item.id,
          }).exec();

          product.stock -= Number(item.quantity);
          product.save();
        };
        updateStock(item);

        return { id: item.id, quantity: item.quantity };
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

router.delete("/user/orders/delete", async (req, res) => {
  try {
    // console.log(req.body);
    const { code, userCode, orderItemsData } = req.body;

    let order = await OrderModel.findOne({
      $and: [{ code }, { userCode }, { status: "En curso" }],
    }).exec();

    if (order) {
      // Restore products stocks
      const arrItemsIDs = orderItemsData.map((item) => {
        return mongoose.Types.ObjectId(item.id);
      });

      console.log(arrItemsIDs);

      let products = await ProductModel.find({ _id: { $in: arrItemsIDs } });

      console.log(products.length); //hasta aca funciona

      let prods = products.map((product) => {
        return { ...product, ["image"]: "" };
      });

      //console.log(prods);

      //si algun id coincide con
      products = products.map(async (product) => {
        console.log(product._id.toString());
        for (let item of orderItemsData) {
          console.log(item.id);

          if (product._id.toString() === item.id) {
            let newStock = Number(product.stock) + Number(item.quantity);
            await ProductModel.findOneAndUpdate(
              { _id: mongoose.Types.ObjectId(item.id) },
              { stock: newStock }
            );
          } else {
            console.log("No paso el if");
          }
        }
      });

      prods = products.map((product) => {
        return { ...product, ["image"]: "" };
      });

      console.log(prods);

      order.status = "Cancelado";
      order = await order.save();

      //return orders updated
      let orders = await OrderModel.find({ userCode });
      res.json(orders);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/user/orders/all", async (req, res) => {
  try {
    //console.log(req.query);
    const { userCode } = req.query;
    //console.log(userCode);
    let orders = await OrderModel.find({ userCode: Number(userCode) });
    if (orders) {
      res.json(orders);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/user/orders/items/list", async (req, res) => {
  try {
    //console.log(req.query);
    let { orderItems } = req.query;

    orderItems = orderItems.map((item) => {
      return JSON.parse(item);
    });
    console.log(orderItems);

    let arrItemsIDs = orderItems.map((item) => {
      return mongoose.Types.ObjectId(item.id);
    });

    console.log(arrItemsIDs);

    let productsFound = await ProductModel.find({ _id: { $in: arrItemsIDs } });

    // console.log({...productsFound[0], image: ""});
    console.log(productsFound[0].name);
    console.log(productsFound.length);

    productsFound = productsFound.map((product) => {
      for (let item of orderItems) {
        if (product._id.toString() === item.id) {
          //console.log("quantity: ", Number(item.quantity));
          product = product.toObject();
          product.quantity = Number(item.quantity);
          console.log(product);
          return product;
        }
      }
    });

    // console.log(productsFound);

    res.json(productsFound);
  } catch (error) {
    console.error(error);
  }
});

//SHOPPING CART
router.get("/user/shopping-cart", async (req, res) => {
  try {
    // console.log(req.query);
    const { userCode } = req.query;

    let shoppingCart = await ShoppingCartModel.findOne({
      code: Number(userCode),
    }).exec();

    shoppingCart ? res.json(shoppingCart) : res.json(null);

    //if there are products in cart, keep refreshing them, except toBuy
    // if (shoppingCart.products.length) {
    //   //cart items IDs

    //   let productsIDs = shoppingCart.products.map((product) => {
    //     return Number(product.code);
    //   });

    //   console.log(productsIDs);

    //   // products updated
    //   let productsUpdated = await ProductModel.find({
    //     code: { $in: productsIDs },
    //   });

    //   console.log(productsUpdated.length);

    //   let productsResult = shoppingCart.products.map((product) => {
    //     for (let product2 of productsUpdated) {
    //       console.log(product2.name);
    //       if (Number(product.code) === Number(product2.code)) {
    //         product2.toBuy = product.toBuy;
    //         return {...product2};
    //       }
    //     }
    //   });

    //   productsResult.forEach((product) => {
    //     console.log(product.name, " | | | ", product.toBuy);
    //   });

    //   // update
    //   shoppingCart = await ShoppingCartModel.findOneAndUpdate(
    //     { code: Number(userCode) },
    //     { products: productsResult }
    //   );
    // }
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/user/shopping-cart/check-item-added", async (req, res) => {
  try {
    //console.log(req.query);
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

router.delete(`/user/shopping-cart/delete`, async (req, res) => {
  try {
    // console.log(req.body);
    const { prodCode, userCode } = req.body;

    // let updateResult = await ShoppingCartModel.updateOne(
    //   { code: Number(userCode) },
    //   { $pull: { products: { code: Number(prodCode) } } }
    // );

    let shoppingCartUpdated = await ShoppingCartModel.findOneAndUpdate(
      {
        code: Number(userCode),
      },
      { $pull: { products: { code: Number(prodCode) } } }
    );

    const productUpdated = await ProductModel.findByIdAndUpdate(
      {
        code: Number(prodCode),
      },
      {
        $set: { isInCart: false },
      }
    );

    res.json(shoppingCartUpdated);
  } catch (error) {
    console.error(error);
  }
}); //working

router.delete("/user/shopping-cart/delete/all", async (req, res) => {
  try {
    // console.log(req.body);
    const { userCode } = req.body;

    let shoppingCart = await ShoppingCartModel.findOneAndUpdate(
      { code: userCode },
      { products: [] }
    );

    //console.log(shoppingCart);

    if (shoppingCart) res.json(shoppingCart);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

router.put("/user/shopping-cart/update/toBuy", async (req, res) => {
  try {
    //console.log(req.body);
    const { userCode, toBuy, itemIndex } = req.body;

    let shoppingCart = await ShoppingCartModel.findOneAndUpdate(
      {
        code: Number(userCode),
      },
      { [`products.${itemIndex}.toBuy`]: toBuy }
    );

    console.log("To Buy updated: ", shoppingCart.products[itemIndex].toBuy);
    res.json(shoppingCart);
  } catch (error) {
    console.error(error);
  }
}); //working

router.put("/user/shopping-cart/add", async (req, res) => {
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
      product.isInCart = true;
      product = product.save();
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

router.post("/payment", (req, res) => {
  try {
    paymentInstance.getPaymentLink(req, res);
  } catch (error) {
    console.error(error);
  }
}); //working

export default router;
