import express from "express";
import User from "../models/user.js";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

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

router.delete("/:id", loadUserFromParamsMiddleware, (req, res, next) => {
	req.user
		.deleteOne()
		.then(() => {
			res.sendStatus(204);
		})
		.catch(next);
});

function loadUserFromParamsMiddleware(req, res, next) {
	const userId = req.params.id;
	if (!ObjectId.isValid(userId)) {
		return userNotFound(res, userId);
	}

	let query = User.findById(userId);

	query
		.exec()
		.then((user) => {
			if (!user) {
				return userNotFound(res, userId);
			}

			req.user = user;
			next();
		})
		.catch(next);
}

function userNotFound(res, userId) {
	return res.status(404).type("text").send(`No users found with ID ${userId}`);
}

export default router;
