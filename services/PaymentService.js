import axios from "axios";
import { Base64 } from "js-base64";

export class PaymentService {
  async createPayment(items2, userCode) {
    const url = "https://api.mercadopago.com/checkout/preferences";

    
    // let param = new URLSearchParams(items2).toString();
    
    let items3 = await items2.map((item) => ({
      title: item.name,
      description: item.description,
      picture_url: "",
      category_id: "category123",
      quantity: item.toBuy,
      unit_price: item.price,
    }));
    
    items2 = JSON.stringify({ ...items2 }, null, 2);

    const body = {
      payer_email: "payer_email@test.com",
      items: items3,
      // items: [
      //   {
      //     title: "Dummy Title",
      //     description: "Dummy description",
      //     picture_url: "",
      //     category_id: "category123",
      //     quantity: 1,
      //     unit_price: 10
      //   }
      // ],
      back_urls: {
        failure: `http://127.0.0.1:12345/user/shopping-cart/${userCode}/failure`,
        pending: `http://127.0.0.1:12345/user/shopping-cart/${userCode}/pending`,
        success: `http://127.0.0.1:12345/user/shopping-cart/${userCode}/success`,
      },
    };

    //console.log("*******", body.items); //imprime correctamente

    const payment = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });

    return payment.data;
  }
}
