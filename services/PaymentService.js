import axios from "axios";

export class PaymentService {
  async createPayment(items2, userCode) {
    console.log("xcasc: ", items2, userCode); //imprime correctamente
    const url = "https://api.mercadopago.com/checkout/preferences";

    const items4 = await items2.map((item)=>item);

    let items3 = await items2.map((item) => ({
      title: item.name,
      description: item.description,
      picture_url: "",
      category_id: "category123",
      quantity: item.toBuy,
      unit_price: item.price,
    }));

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
        failure: "http://127.0.0.1:12345/failure",
        pending: "http://127.0.0.1:12345/pending",
        success: `http://127.0.0.1:12345/success/${userCode}/${items4}`,
      },
    };

    console.log("*******", body.items); //imprime correctamente

    const payment = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });

    return payment.data;
  }
}
