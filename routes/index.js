import express from "express";
const router = express.Router();

router.get("/", function (req, res, next) {
	res.send(
		"Welcome to our API, please refer to the documentation to use it properly, go to /api-docs to see it"
	);
});

export default router;
