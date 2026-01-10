exports.sendOtp = async (req, res) => {
if (req.body.email.includes("gmail.com")) {
return res.status(400).json({ message: "Only company emails allowed" });
}
const otp = Math.floor(100000 + Math.random() * 900000);
// save OTP in DB or cache
await sendOtpEmail(req.body.email, otp);
res.json({ success: true });
};