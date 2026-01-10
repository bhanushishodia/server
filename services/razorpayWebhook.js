exports.handleWebhook = async (req, res) => {
const event = req.body.event;
if (event === "payment.captured") {
await generateInvoice(req.body.payload.payment.entity);
await sendPaymentConfirmationEmail();
}
res.json({ status: "ok" });
};