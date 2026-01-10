router.post("/company", upload.array("docs"), async (req, res) => {
await Company.create({ ...req.body, documents: req.files.map(f => f.path) });
res.json({ success: true });
});