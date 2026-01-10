const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoicePDF = (data) => {
    return new Promise((resolve, reject) => {
        const dir = path.join(__dirname, "../uploads/invoices");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const fileName = `invoice_${Date.now()}.pdf`;
        const filePath = path.join(dir, fileName);

        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(20).text("TAX INVOICE", { align: "center" });
        doc.moveDown();

        doc.text(`Company: ${data.companyName}`);
        doc.text(`Email: ${data.email}`);
        doc.text(`Plan: ${data.planName}`);
        doc.text(`Amount Paid: ₹${data.amount}`);
        doc.text(`Payment ID: ${data.paymentId}`);


        doc.end();
        resolve(filePath);
    });
};

const generateAgreementPDF = (data) => {
    return new Promise((resolve, reject) => {
        const dir = path.join(__dirname, "../uploads/agreements");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const fileName = `agreement_${Date.now()}.pdf`;
        const filePath = path.join(dir, fileName);

        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(18).text("SERVICE AGREEMENT", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(
            `This agreement is between Anantya Platform and ${data.company}.`
        );
        doc.moveDown();
        doc.text("Client has accepted Terms & Conditions digitally.");

        doc.end();
        resolve(filePath);
    });
};

module.exports = {
    generateInvoicePDF,
    generateAgreementPDF,
};
