export class PaymentController {
  constructor(subscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  async getPaymentLink(req, res) {
    try {
      const { items, userCode } = req.body;
      const payment = await this.subscriptionService.createPayment(items, userCode);

      return res.json(payment);
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({ error: true, msg: "Failed to create payment" });
    }
  }
}
