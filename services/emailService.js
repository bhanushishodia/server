const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Email address
    pass: process.env.EMAIL_PASSWORD, // App password
  },
});
// send email to admin
async function sendEmailToAdmin(clientName, clientEmail, mobile, company) {
  try {
    const mailOptionsAdmin = {
      from: process.env.EMAIL_USER,
      to: 'info@anantya.ai',
      cc: 'Mokshika@anantya.ai',
      subject: 'New Client Form Submission',
      text: `Client Name: ${clientName}\nClient Email: ${clientEmail}\nMobile: ${mobile}\nCompany: ${company}`, // Includes Client Name
    };
    const result = await transporter.sendMail(mailOptionsAdmin);
    console.log('Admin email sent:', result);
  } catch (error) {
    console.error('Error sending email to admin:', error);
    throw error; // Ensure errors are propagated
  }
}

// send email to client
async function sendEmailToClient(clientEmail, clientName, mobile, company) {
  try {
    const mailOptionsClient = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      cc: 'Mokshika@anantya.ai',
      subject: 'Welcome to the Anantya.ai!',
      html: `
        <p>Dear ${clientName},</p>
        <p>Thank you for showing interest in Anantya.ai! </p>
        <p>We’re beyond excited to have you on board! You’re now one step closer to revolutionizing your business communication with cutting-edge tools like WhatsApp, SMS, and AI — all in one powerful platform. 🎉</p>
        <p>At Anantya, we’ve worked with many businesses like yours, so we understand the challenges you might be facing.</p>
        <p>Here are a few ways we can support you:</p>
        <ul>
          <li>Boost customer support with AI chatbots that work around the clock.</li>
          <li>Turn your data into valuable insights to make smarter business decisions.</li>
          <li>Automate daily tasks to save time and cut costs.</li>
          <li>Create custom AI solutions tha fit your specific goals.</li>
        </ul>
        <p>We can’t wait to see what you’ll achieve!</p>
        <p>If you have any questions, we’re just an email away at <a href="mailto:info@anantya.ai">info@anantya.ai</a>.</p>
        <p>Let’s build something amazing together!</p>
        <p>Warm regards,<br><strong>The Anantya.ai Team</strong></p>
      `,
    };
    const result = await transporter.sendMail(mailOptionsClient);
    console.log('Client email sent:', result);
  } catch (error) {
    console.error('Error sending email to client:', error);
    throw error; // Ensure errors are propagated
  }
}
// send email when payment done
async function sendPaymentConfirmationEmail(clientEmail, clientName) {
  try {
    const mailOptionsPayment = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      cc: 'Mokshika@anantya.ai',
      subject: 'You’re All Set! Let’s Get Started 🚀',
      html: `
        <p>Hey ${clientName},</p>
        <p>The wait is over — you’re officially part of the Anantya.ai! 🎉 Your payment has been successfully processed, and we’re excited to help you unlock the full potential of your business communication.</p>
        <p>Here’s what’s coming next:</p>
        <ol>
          <li><strong>Credentials & Agreement:</strong> Your account credentials and signed agreement are on their way via email.</li>
          <li><strong>Explore the Platform:</strong> We’ve got a quick video to help you get started. It’s packed with tips to make sure you get the most out of our platform.</li>
          <li><strong>Need Support?</strong> Don’t worry — if you need any help or have questions, our support team is here for you every step of the way!</li>
        </ol>
        <p>We’re here to make your experience seamless and rewarding. Anantya.ai is all about empowering businesses to connect, engage, and thrive — and we’re excited to be part of your journey!</p>
        <p>If you have any questions or need anything at all, just hit reply or contact us at <a href="mailto:info@anantya.ai">info@anantya.ai</a>. Let’s make some magic happen! ✨</p>
        <p>Warm regards,<br><strong>The Anantya.ai Team</strong></p>
      `,
    
    };
    const result = await transporter.sendMail(mailOptionsPayment);
    console.log('Payment confirmation email sent:', result);
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    throw error; // Ensure errors are propagated
  }
}
async function sendOtpEmail(clientEmail, clientName, otp) {
  console.log( "bhanu", clientEmail, clientName);
  try {
    const mailOptionsOtp = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: 'Anantya.ai E-Mail Verification Code',
      html: `
        <p>Dear ${clientName},</p>
        <p>To proceed with your request, please use the following One-Time Password (OTP):</p>
        <h2 style="color: #2e86de;">Your OTP: ${otp}</h2>
        <p>This code is valid for the next 5 minutes. Please do not share it with anyone for security purposes.</p>
        <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
        <p>Thank you for choosing Anantya.ai.</p>
        <p>Best regards,<br><strong>Team Anantya.ai</strong></p>
      `,
    };
    const result = await transporter.sendMail(mailOptionsOtp);
    console.log('OTP email sent:', result);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
}

async function sendEmail({ name, email, mobile, company }) {
  console.log('Preparing to send email...');
  try {
    await sendEmailToAdmin(name, email, mobile, company); // Correctly passing 'name' as the first parameter
    await sendEmailToClient(email, name, mobile, company); // Order adjusted to match function definition
    console.log('Both emails sent successfully!');
  } catch (error) {
    console.error('Failed to send emails:', error.message);
    throw new Error('Failed to send emails');
  }
}


// Export functions
module.exports = {
  sendEmail,
  sendPaymentConfirmationEmail,
  sendOtpEmail,
};