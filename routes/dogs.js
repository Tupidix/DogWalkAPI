import express from "express";
import Dog from "../models/dog.js";

const router = express.Router();

// router.get("/", function (req, res, next) {
// 	res.send("Got a response from the dogs route");
// });

/* GET dogs listing. */
router.get("/", function (req, res, next) {
	Dog.find()
		.sort("name")
		.exec()
		.then((dogs) => {
			res.send(dogs);
		})
		.catch((err) => {
			next(err);
		});
});

/* POST new dog */
router.post("/", (req, res, next) => {
	// Create a new document from the JSON in the request body
	const newDog = new Dog(req.body);
	// Save that document
	newDog
		.save()
		.then((savedDog) => {
			// Send the saved document in the response
			res.send(savedDog);
		})
		.catch((err) => {
			next(err);
		});
});

export default router;
