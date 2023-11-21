import express from "express";
import User from "../models/user.js";

const router = express.Router();

// router.get("/", function (req, res, next) {
// 	res.send("Got a response from the users route");
// });

/* GET users listing. */
router.get("/", function (req, res, next) {
	User.find()
		// .select(["firstname", "lastname"])
		.sort("firstname")
		.exec()
		.then((users) => {
			res.send(users);
		})
		.catch((err) => {
			next(err);
		});
});

router.get("/:id", (req, res, next) => {
	User.findById(req.params.id)
		.exec()
		.then((users) => {
			res.send(users);
		})
		.catch((err) => {
			next(err);
		});
});

/* POST new user */
router.post("/", (req, res, next) => {
	// Create a new document from the JSON in the request body
	const newUser = new User(req.body);
	// Save that document
	newUser
		.save()
		.then((savedUser) => {
			// Send the saved document in the response
			res.send(savedUser);
		})
		.catch((err) => {
			next(err);
		});
});

export default router;
