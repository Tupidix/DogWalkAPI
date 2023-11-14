import express from "express";
import Walk from "../models/walk.js";

const router = express.Router();

// router.get("/", function (req, res, next) {
// 	res.send("Got a response from the walks route");
// });

/* GET walks listing. */
router.get("/", function (req, res, next) {
	Walk.find()
		.sort("name")
		.exec()
		.then((walks) => {
			res.send(walks);
		})
		.catch((err) => {
			next(err);
		});
});

/* POST new walk */
router.post("/", (req, res, next) => {
	// Create a new document from the JSON in the request body
	const newWalk = new Walk(req.body);
	// Save that document
	newWalk
		.save()
		.then((savedWalk) => {
			// Send the saved document in the response
			res.send(savedWalk);
		})
		.catch((err) => {
			next(err);
		});
});

export default router;
