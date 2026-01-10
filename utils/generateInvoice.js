const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");


module.exports.generateInvoice = (data) => {
return new Promise((resolve) => {
const doc = new PDFDocument({ margin: 50 });


const fileName = `invoice_${Date.now()}.pdf`;
const filePath = path.join(__dirname, "../invoices", fileName);


doc.pipe(fs.createWriteStream(filePath));


doc.fontSize(20).text("INVOICE", { align: "center" });
doc.moveDown();


doc.fontSize(12).text(`Company: ${data.companyName}`);
doc.text(`Client Name: ${data.name}`);
doc.text(`Email: ${data.email}`);
doc.text(`Mobile: ${data.mobile}`);


doc.moveDown();
doc.text(`Plan: ${data.plan.name}`);
doc.text(`Plan Price: ₹${data.plan.price}`);


data.addons.forEach((a) => {
doc.text(`Addon: ${a.name} - ₹${a.price}`);
});


doc.moveDown();
doc.fontSize(14).text(`Total Paid: ₹${data.total}`, { bold: true });


doc.end();


resolve(filePath);
});
};