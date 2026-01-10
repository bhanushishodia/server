const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
async function sendEmail({ name, email, mobile, company }) {
  await sendEmailToAdmin(name, email, mobile, company);
  await sendEmailToClient(email, name, mobile, company);
}

/* ================= ADMIN EMAIL ================= */
async function sendEmailToAdmin(clientName, clientEmail, mobile, company) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "info@anantya.ai",
    cc: ["Mokshika@anantya.ai", "bhanu@anantya.ai", "sales@anantya.ai"],
    subject: "New Client Form Submission",
    text: `Client Name: ${clientName}
Email: ${clientEmail}
Mobile: ${mobile}
Company: ${company}`,
  };

  await transporter.sendMail(mailOptions);
}

/* ================= CLIENT WELCOME EMAIL ================= */
async function sendEmailToClient(clientEmail, clientName, mobile, company) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: clientEmail,
    cc: ["Mokshika@anantya.ai", "bhanu@anantya.ai", "sales@anantya.ai"],
    subject: "Welcome to Anantya.ai!",
    html: `
      <p>Dear ${clientName},</p>
      <p>Welcome to <strong>Anantya.ai</strong> 🎉</p>
      <p>We’re excited to have you onboard.</p>
      <p>Regards,<br/>Team Anantya.ai</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

/* ================= PAYMENT CONFIRMATION ================= */
async function sendPaymentConfirmationEmail(clientEmail, clientName) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: clientEmail,
    cc: ["Mokshika@anantya.ai"],
    subject: "Payment Successful – Anantya.ai 🚀",
    html: `
      <p>Hi ${clientName},</p>
      <p>Your payment has been successfully received.</p>
      <p>Invoice & receipt are attached.</p>
      <p>Team Anantya.ai</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

/* ================= OTP EMAIL ================= */
async function sendOtpEmail(clientEmail, clientName, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: clientEmail,
    subject: "Anantya.ai Email Verification Code",
    html: `
      <p>Hello ${clientName},</p>
      <h2>Your OTP: ${otp}</h2>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

/* ================= INVOICE + RECEIPT EMAIL ================= */
async function sendPaymentDocsEmail(
  clientEmail,
  clientName,
  invoicePath,
  receiptPath
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: clientEmail,
    cc: ["Mokshika@anantya.ai", "bhanu@anantya.ai"],
    subject: "Invoice & Receipt – Anantya.ai",
    html: `
      <p>Hi ${clientName},</p>
      <p>Thank you for your payment.</p>
      <p>Please find attached:</p>
      <ul>
        <li>Tax Invoice</li>
        <li>Payment Receipt</li>
      </ul>
      <p>Welcome to Anantya.ai 🚀</p>
    `,
    attachments: [
      { filename: "Invoice.pdf", path: invoicePath },
      { filename: "Receipt.pdf", path: receiptPath },
    ],
  };

  await transporter.sendMail(mailOptions);
}

/* ================= EXPORTS (ONLY ONCE) ================= */
module.exports = {
  sendEmailToAdmin,
  sendEmailToClient,
  sendEmail,
  sendPaymentConfirmationEmail,
  sendOtpEmail,
  sendPaymentDocsEmail,
};
