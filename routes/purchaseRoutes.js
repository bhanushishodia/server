router.post("/purchase/create", async (req, res) => {
const purchaseId = crypto.randomUUID();
await Purchase.create({ purchaseId, clientEmail: req.body.email });
res.json({ link: `${process.env.FRONTEND_URL}/purchase/${purchaseId}` });
});