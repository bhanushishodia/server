exports.generateInvoice = async (payment) => {
const gst = payment.amount * 0.18;
await Invoice.create({
invoiceNo: "INV-" + Date.now(),
amount: payment.amount,
gst,
total: payment.amount + gst
});
};