const InvoiceSchema = new mongoose.Schema({
invoiceNo: String,
amount: Number,
gst: Number,
total: Number
});