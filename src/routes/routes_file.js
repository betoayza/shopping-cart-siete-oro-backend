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
    const allUsers = await UserModel.find({});
    res.json(allUsers);
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/admin/users/search/one", async (req, res) => {
  try {
    const { code } = req.query;
    const user = await UserModel.findOne({ code }).exec();

    res.json(user);
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/admin/users/search", async (req, res) => {
  try {
    const { term } = req.query;
    let termNumber = null;
    isNaN(Number(term)) ? term : (termNumber = Number(term));

    const users = await UserModel.find({
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

    res.json(users);
  } catch (error) {
    console.error(error);
  }
}); //working

router.delete("/admin/users/delete", async (req, res) => {
  try {
    const { code } = req.body;
    let user = await UserModel.findOne({
      $and: [{ code }, { status: "Activo" }],
    }).exec();

    if (user) {
      user.status = "Banneado";
      user = await user.save();
      res.json(user);
    } else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

router.put("/admin/users/activate", async (req, res) => {
  try {
    const { code } = req.body;
    let user = await UserModel.findOne({
      $and: [{ code }, { status: "Banneado" }],
    }).exec();

    if (user) {
      user.status = "Activo";
      user = await user.save();
      res.json(user);
    } else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

//ORDERS
router.get("/admin/orders/all", async (req, res) => {
  try {
    const allOrders = await OrderModel.find({});
    res.json(allOrders);
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/admin/orders/code", async (req, res) => {
  try {
    const { code } = req.query;
    const order = await OrderModel.findOne({
      $and: [{ code }, { status: "Activo" }],
    }).exec();

    res.json(order || null);
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/admin/orders/search", async (req, res) => {
  try {
    const { term } = req.query;
    let termNumber = null;
    isNaN(Number(term)) ? term : (termNumber = Number(term));

    const orders = await OrderModel.find({
      $or: [
        { code: termNumber },
        { userCode: termNumber },
        // { products: { $regex: `^${term}`, $options: "i" } },
        { amount: termNumber },
        { date: { $regex: `^${term}`, $options: "i" } },
        { status: { $regex: `^${term}`, $options: "i" } },
      ],
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
  }
}); //working

router.put("/admin/orders/change-state", async (req, res) => {
  try {
    const { code, newState } = req.body;
    const orderUpdated = await OrderModel.findOneAndUpdate(
      { code: Number(code) },
      { status: newState },
      { new: true }
    );

    res.json(orderUpdated);
  } catch (error) {
    console.error(error);
  }
});

//PRODUCTS
router.get("/products/all", async (req, res) => {
  try {
    const allProducts = await ProductModel.find({});

    res.json(allProducts);
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/admin/products/search", async (req, res) => {
  try {
    const { term } = req.query;
    let termNumber = null;
    isNaN(Number(term)) ? term : (termNumber = Number(term));

    const products = await ProductModel.find({
      $or: [
        { code: termNumber },
        { name: { $regex: `^${term}`, $options: "i" } },
        { description: { $regex: `^${term}`, $options: "i" } },
        { price: termNumber },
        { stock: termNumber },
        { status: { $regex: `^${term}`, $options: "i" } },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error(error);
  }
}); //working

router.post("/admin/product/add", upload.single("image"), async (req, res) => {
  try {
    const { code, name, description, status } = req.body;
    const productExists = await ProductModel.findOne({
      $and: [
        {
          $or: [{ code }, { name }],
        },
        { description },
        { status },
      ],
    }).exec();

    if (productExists) {
      res.json(null);
    } else {
      const { name, description, price, stock, toBuy, status } = req.body;
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

      newProduct = await newProduct.save();
      res.json(newProduct);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.put("/admin/products/activate", async (req, res) => {
  try {
    const { code } = req.body;
    let product = await ProductModel.findOne({
      $and: [{ code }, { status: "Dado de baja" }],
    }).exec();

    if (product) {
      product.status = "Activo";
      productUpdated = await product.save();
      res.json(productUpdated);
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
      const { code, name, description, price, stock } = req.body;
      const productUpdated = await ProductModel.findOneAndUpdate(
        { code },
        { name, description, price, stock },
        { new: true }
      );

      res.json(productUpdated);
    } catch (error) {
      console.error(error);
    }
  }
); //working

router.delete("/admin/products/delete", async (req, res) => {
  try {
    const { code } = req.body;
    let product = await ProductModel.findOne({
      $and: [{ code }, { status: "Activo" }],
    }).exec();

    if (product) {
      product.status = "Dado de baja";
      productOffline = await product.save();
      res.json(productOffline);
    } else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/admin/products/search/code", async (req, res) => {
  try {
    const { code } = req.query;
    const product = await ProductModel.findOne({
      code,
    }).exec();

    res.json(product);
  } catch (error) {
    console.error(error);
  }
}); //working

//-----------------LOGIN & SIGNUP-----------------------

//LOGIN & SIGNUP (working)
router.get("/login", async (req, res) => {
  try {
    const { data, password } = req.query;
    const user = await UserModel.findOne({
      $and: [
        { $or: [{ email: data }, { username: data }] },
        { password },
        { status: "Activo" },
      ],
    }).exec();

    res.json(user);
  } catch (error) {
    console.error(error);
  }
}); //working

router.post("/signup", async (req, res) => {
  try {
    const { email, username } = req.body;
    //if there are not users, create admin
    let allUsers = await UserModel.find({});

    if (!allUsers.length) {
      const dataUser = { ...req.body };
      dataUser.type = "Admin";

      const newUser = new UserModel(dataUser);
      adminUser = await newUser.save();

      res.json(adminUser);
    } else {
      const userAlreadyExists = await UserModel.findOne({
        $or: [{ email }, { username }],
      }).exec();
      if (userAlreadyExists) {
        res.json(null);
      } else {
        //register user
        const dataUser = { ...req.body };
        let newUser = new UserModel(dataUser);
        newUser = await newUser.save();

        //Create shopping cart to new user
        let newShoppingCart = new ShoppingCartModel({
          code: newUser.code,
          products: [],
        }); //shopping cart code is user code
        newShoppingCart = await newShoppingCart.save();

        res.json(newUser);
      }
    }
  } catch (error) {
    console.log(error);
  }
}); //working

//-------------------NOT USER ---------------------------
router.get("/products/active/all", async (req, res) => {
  try {
    const activeProducts = await ProductModel.find({ status: "Activo" });

    res.json(activeProducts);
  } catch (error) {
    console.error(error);
  }
});

//-------------------USER ROUTES-------------------------------

//GET DATA USER

router.get("/user/get", async (req, res) => {
  try {
    const { userCode } = req.query;
    const user = await UserModel.findOne({ code: userCode }).exec();

    res.json(user);
  } catch (error) {
    console.error(error);
  }
});

//PRODUCTS
router.get("/products/get", async (req, res) => {
  try {
    const { term } = req.query;
    const productsMatched = await ProductModel.find({
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

    res.json(productsMatched);
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/product/code", async (req, res) => {
  try {
    const { productCode } = req.query;
    const product = await ProductModel.findOne({ code: productCode }).exec();

    res.json(product);
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/products/get/list", async (req, res) => {
  try {
    let { itemsIDs } = req.query;
    itemsIDs = itemsIDs.map((id) => {
      return mongoose.Types.ObjectId(id);
    });

    const products = await ProductModel.find({
      _id: { $in: itemsIDs },
    });

    res.json(products);
  } catch (error) {
    console.error(error);
  }
}); //working

//EDIT PROFILE
router.put("/user/profile/modify", async (req, res) => {
  try {
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
    } else res.json(null);
  } catch (error) {
    console.error(error);
  }
}); //working

router.post("/user/comment/add", async (req, res) => {
  try {
    let { userCode, comment, productCode } = req.body;
    const user = await UserModel.findOne({ code: userCode }).exec();
    let product = await ProductModel.findOne({ code: productCode }).exec();

    if (product && user) {
      const username = user.username;
      comment = { username, comment, status: "Active" };
      product.comments.push(comment);
      await product.save();

      res.json(true);
    } else res.json(null);
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

    if (deleteResult.modifiedCount === 1) res.json(true);
    else res.json(null);
  } catch (error) {
    console.error(error);
  }
});

//ORDERS
router.get("/user/orders", async (req, res) => {
  try {
    const { userCode } = req.query;
    const orders = await OrderModel.find({ code: userCode });

    res.json(orders);
  } catch (error) {
    console.error(error);
  }
}); //working

router.post("/user/orders/add", async (req, res) => {
  try {
    const { userCode, items, installments, totalAmount } = req.body;
    const user = await UserModel.findOne({ code: userCode }).exec();

    if (user) {
      // update products stocks
      let products = await items.map((item) => {
        const updateStock = async (item) => {
          //updated product stock
          let product = await ProductModel.findOne({
            _id: item.id,
          }).exec();

          product.stock -= Number(item.quantity);
          await product.save();
        };
        updateStock(item);

        return { id: item.id, quantity: item.quantity };
      });

      // create order
      let newOrder = new OrderModel({
        code: Date.now(),
        userCode,
        products,
        amount: totalAmount,
        date: moment(new Date()).format("DD/MM/YYYY"),
        status: "En curso",
      });
      newOrder = await newOrder.save();

      res.json(newOrder);
    }
  } catch (error) {
    console.error(error);
  }
}); //working

router.delete("/user/orders/delete", async (req, res) => {
  try {
    const { code, userCode, orderItemsData } = req.body;
    const order = await OrderModel.findOne({
      $and: [{ code }, { userCode }, { status: "En curso" }],
    }).exec();

    if (order) {
      const arrItemsIDs = orderItemsData.map((item) => {
        return mongoose.Types.ObjectId(item.id);
      });
      const productsMatched = await ProductModel.find({
        _id: { $in: arrItemsIDs },
      });

      // Restore products stocks
      let restoredProducts = productsMatched.map(async (product) => {
        for (let item of orderItemsData) {
          if (product._id.toString() === item.id) {
            const newStock = Number(product.stock) + Number(item.quantity);
            await ProductModel.findOneAndUpdate(
              { _id: mongoose.Types.ObjectId(item.id) },
              { stock: newStock }
            );
          }
        }
      });

      restoredProducts = restoredProducts.map((product) => {
        return { ...product, ["image"]: "" };
      });

      order.status = "Cancelado";
      order = await order.save();

      // Return orders updated
      const orders = await OrderModel.find({ userCode });

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
    const { userCode } = req.query;
    const orders = await OrderModel.find({ userCode: Number(userCode) });

    res.json(orders);
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/user/orders/items/list", async (req, res) => {
  try {
    let { orderItems } = req.query;

    orderItems = orderItems.map((item) => {
      return JSON.parse(item);
    });

    let arrItemsIDs = orderItems.map((item) => {
      return mongoose.Types.ObjectId(item.id);
    });

    let productsFound = await ProductModel.find({ _id: { $in: arrItemsIDs } });

    productsFound = productsFound.map((product) => {
      for (let item of orderItems) {
        if (product._id.toString() === item.id) {
          product = product.toObject();
          product.quantity = Number(item.quantity);

          return product;
        }
      }
    });

    res.json(productsFound);
  } catch (error) {
    console.error(error);
  }
});

//SHOPPING CART
router.get("/user/shopping-cart", async (req, res) => {
  try {
    const { userCode } = req.query;
    const shoppingCart = await ShoppingCartModel.findOne({
      code: Number(userCode),
    }).exec();

    res.json(shoppingCart);
  } catch (error) {
    console.error(error);
  }
}); //working

router.get("/user/shopping-cart/check-item-added", async (req, res) => {
  try {
    const { userCode, prodCode } = req.query;
    const isAdded = await ShoppingCartModel.findOne({
      $and: [
        {
          code: Number(userCode),
        },
        {
          products: { $elemMatch: { code: Number(prodCode) } },
        },
      ],
    }).exec();

    isAdded ? res.json(true) : res.json(false);
  } catch (error) {
    console.error(error);
  }
}); //working

router.delete(`/user/shopping-cart/delete`, async (req, res) => {
  try {
    const { prodCode, userCode } = req.body;
    const shoppingCartUpdated = await ShoppingCartModel.findOneAndUpdate(
      {
        code: Number(userCode),
      },
      { $pull: { products: { code: Number(prodCode) } } },
      { new: true }
    );

    await ProductModel.findOneAndUpdate(
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

// SEGUIR ACA
router.delete("/user/shopping-cart/delete/all", async (req, res) => {
  try {
    const { userCode } = req.body;

    const shoppingCart = await ShoppingCartModel.findOne({
      code: Number(userCode),
    });

    if (shoppingCart) {
      const productCodesArrays = shoppingCart.products;

      await ProductModel.updateMany(
        { code: { $in: productCodesArrays } },
        { $set: { isInCart: false } }
      );
    }

    // limpiar shopping cart
    const shoppingCartUpdated = await ShoppingCartModel.findOneAndUpdate(
      { code: userCode },
      { products: [] },
      { new: true, omitUndefined: true }
    );

    res.json(shoppingCartUpdated);
  } catch (error) {
    console.error(error);
  }
}); //working

router.put("/user/shopping-cart/update/toBuy", async (req, res) => {
  try {
    const { userCode, toBuy, itemIndex } = req.body;
    const shoppingCartUpdated = await ShoppingCartModel.findOneAndUpdate(
      {
        code: Number(userCode),
      },
      { [`products.${itemIndex}.toBuy`]: toBuy },
      { new: true }
    );

    res.json(shoppingCartUpdated);
  } catch (error) {
    console.error(error);
  }
}); //working

router.put("/user/shopping-cart/add", async (req, res) => {
  try {
    const { productCode, userCode } = req.body;

    let shoppingCart = await ShoppingCartModel.findOne({
      code: Number(userCode),
    }).exec();

    let product = await ProductModel.findOne({
      $and: [{ code: Number(productCode) }, { status: "Activo" }],
    }).exec();

    const isProductAdded = await ShoppingCartModel.findOne({
      $and: [
        {
          code: Number(userCode),
        },
        {
          products: { $elemMatch: { code: Number(productCode) } },
        },
      ],
    }).exec();

    if (shoppingCart && product && !isProductAdded) {
      product.isInCart = true;
      product = await product.save();
      shoppingCart.products.push(product);
      await shoppingCart.save();

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
