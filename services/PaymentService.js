import axios from "axios";

export class PaymentService {
  async createPayment(products) {
    const url = "https://api.mercadopago.com/checkout/preferences";   

    const items = products.map((item) => ({
      title: item.name,
      description: item.description,
      picture_url: "",
      category_id: "category123",
      quantity: item.toBuy,
      unit_price: item.price,
    }));

    const body = {
      payer_email: "payer_email@test.com",
      items,
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
        failure: "/failure",
        pending: "/pending",
        success: "/success",
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
