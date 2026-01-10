exports.applyCoupon = async (req, res) => {
const coupon = await Coupon.findOne({ code: req.body.code });
if (!coupon || coupon.expiry < new Date()) {
return res.status(400).json({ message: "Invalid coupon" });
}
res.json({ discount: coupon.value });
};