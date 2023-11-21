import express from "express";
import User from "../models/user.js";
import mongoose from "mongoose";
import requireJson from "../utils/requirejson.js";

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

router.get("/:id", loadUserFromParamsMiddleware, (req, res, next) => {
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

router.patch(
	"/:id",
	requireJson,
	loadUserFromParamsMiddleware,
	(req, res, next) => {
		// Update only properties present in the request body
		if (req.body.firstname !== undefined) {
			req.user.firstname = req.body.firstname;
		}

		if (req.body.lastname !== undefined) {
			req.user.lastname = req.body.lastname;
		}

		if (req.body.email !== undefined) {
			req.user.email = req.body.email;
		}

		if (req.body.password !== undefined) {
			req.user.password = req.body.password;
		}

		if (req.body.birthdate !== undefined) {
			req.user.birthdate = req.body.birthdate;
		}

		if (req.body.isAdmin !== undefined) {
			req.user.isAdmin = req.body.isAdmin;
		}

		if (req.body.localisation !== undefined) {
			req.user.localisation = req.body.localisation;
		}

		if (req.body.currentPath !== undefined) {
			req.user.currentPath = req.body.currentPath;
		}

		req.user
			.save()
			.then((savedUser) => {
				// 	debug(`Updated user "${savedUser.title}"`);
				res.send(savedUser);
			})
			.catch(next);
	}
);

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
