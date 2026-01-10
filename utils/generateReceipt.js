const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");


module.exports.generateReceipt = (data) => {
return new Promise((resolve) => {
const doc = new PDFDocument({ margin: 50 });


const fileName = `receipt_${Date.now()}.pdf`;
const filePath = path.join(__dirname, "../receipts", fileName);


doc.pipe(fs.createWriteStream(filePath));


doc.fontSize(18).text("PAYMENT RECEIPT", { align: "center" });
doc.moveDown();


doc.fontSize(12).text(`Received From: ${data.name}`);
doc.text(`Amount: ₹${data.total}`);
doc.text(`Payment ID: ${data.payment_id}`);
doc.text(`Date: ${new Date().toLocaleDateString()}`);


doc.moveDown();
doc.text("Thank you for your payment!", { align: "center" });


doc.end();


resolve(filePath);
});
};