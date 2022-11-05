import axios from "axios";

export class PaymentService {
  async createPayment(items2, userCode) {
    const url = "https://api.mercadopago.com/checkout/preferences";

    let items3 = items2.map((item) => ({
      id: item._id,
      title: item.name,
      currency_id: "ARS",
      picture_url: "",
      description: item.description,
      category_id: "Panificados",
      quantity: item.toBuy,
      unit_price: item.price,
    }));

    const body = {
      payer_email: "payer_email@test.com",
      items: items3,
      back_urls: {
        failure: `https://betoayza.github.io/shopping-cart-siete-oro-frontend/#/user/shopping-cart/${userCode}`,
        pending: `https://betoayza.github.io/shopping-cart-siete-oro-frontend/#/user/shopping-cart/${userCode}/pending`,
        success: `https://betoayza.github.io/shopping-cart-siete-oro-frontend/#/user/shopping-cart/${userCode}/success`,
      },
    };

    const payment = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });

    return payment.data;
  }
}
