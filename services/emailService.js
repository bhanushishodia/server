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
    cc: ["Mokshika@anantya.ai", "bhanu@anantya.ai", "sales@anantya.ai", "lakshay@anantya.ai"],
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
    cc: ["Mokshika@anantya.ai", "bhanu@anantya.ai", "sales@anantya.ai", "lakshay@anantya.ai"],
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

/* ================= PAYMENT VERIFY EMAIL (ACCOUNTS) ================= */
async function sendPaymentVerifyEmail({
  customerName,
  customerEmail,
  amount,
  method,
  paymentId,
  verifyUrl
}) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "sagar@anantya.ai",
    cc: ["Mokshika@anantya.ai", "bhanu@anantya.ai", "sales@anantya.ai", "lakshay@anantya.ai"],
    subject: "Payment Verification Required – Anantya.ai",
    html: `
      <p><strong>New payment requires verification</strong></p>

      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Amount:</strong> ₹${amount}</p>
      <p><strong>Payment Mode:</strong> ${method}</p>
      <p><strong>Payment ID:</strong> ${paymentId}</p>

      <hr />

      <p>
        <a href="${verifyUrl}" 
           style="background:#28a745;color:#fff;padding:10px 16px;
                  text-decoration:none;border-radius:4px;">
          ✅ Verify Payment
        </a>
      </p>

      <p style="font-size:12px;color:#777">
        This link is secure and time-limited.
      </p>
    `,
  };

  await transporter.sendMail(mailOptions);
}


/* ================= PAYMENT CONFIRMATION ================= */
async function sendPaymentConfirmationEmail(
  clientEmail,
  clientName,
  amount,
  planName
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: clientEmail,
    cc: ["Mokshika@anantya.ai", "bhanu@anantya.ai", "sales@anantya.ai", "lakshay@anantya.ai"],
    subject: "Payment Confirmed – Welcome to Anantya.ai 🎉",
    html: `
      <p>Hi ${clientName},</p>

      <p>Your payment of <strong>₹${amount}</strong> 
      for <strong>${planName}</strong> has been successfully verified.</p>

      <p>Our onboarding team will contact you shortly.</p>

      <p>Welcome to <strong>Anantya.ai</strong> 🚀</p>
      <br/>
      <p>Regards,<br/>Team Anantya.ai</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}


/* ================= OTP EMAIL ================= */
async function sendOtpEmail(clientEmail, clientName, otp) {
  console.log("📨 OTP REQUEST RECEIVED:", {
    clientEmail,
    clientName,
    otpPresent: !!otp,
    time: new Date().toISOString(),
  });

  try {
    const mailOptions = {
      from: `"Anantya.ai" <${process.env.EMAIL_USER}>`,
      to: clientEmail,
      subject: "Anantya.ai Email Verification Code",
      html: `
        <p>Hello ${clientName},</p>
        <h2>Your OTP: ${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    };

    console.log("📤 Attempting SMTP verify...");
    await transporter.verify();
    console.log("✅ SMTP verified before sending OTP");

    console.log("📤 Sending OTP email...");
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ OTP EMAIL SENT", {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    return true;
  } catch (error) {
    console.error("❌ OTP EMAIL FAILED", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });

    throw error;
  }
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
    cc: ["Mokshika@anantya.ai", "bhanu@anantya.ai", "sales@anantya.ai", "lakshay@anantya.ai"],
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
  sendPaymentVerifyEmail,
};
