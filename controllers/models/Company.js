const CompanySchema = new mongoose.Schema({
name: String,
gst: String,
address: String,
documents: [String]
});