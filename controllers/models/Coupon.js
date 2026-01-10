const CouponSchema = new mongoose.Schema({
code: String,
type: String,
value: Number,
expiry: Date,
usageLimit: Number
});