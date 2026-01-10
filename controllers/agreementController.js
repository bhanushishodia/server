exports.acceptTerms = async (req, res) => {
await Agreement.create({
agreementId: crypto.randomUUID(),
companyName: req.body.company,
acceptedAt: new Date(),
termsVersion: "v1.1"
});
res.json({ success: true });
};