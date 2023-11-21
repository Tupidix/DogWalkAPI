import express from "express";
import Dog from "../models/dog.js";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

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

router.get("/:id", loadDogFromParamsMiddleware, (req, res, next) => {
	Dog.findById(req.params.id)
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

router.delete("/:id", loadDogFromParamsMiddleware, (req, res, next) => {
	req.dog
		.deleteOne()
		.then(() => {
			res.sendStatus(204);
		})
		.catch(next);
});

function loadDogFromParamsMiddleware(req, res, next) {
	const dogId = req.params.id;
	if (!ObjectId.isValid(dogId)) {
		return dogNotFound(res, dogId);
	}

	let query = Dog.findById(dogId);

	query
		.exec()
		.then((dog) => {
			if (!dog) {
				return dogNotFound(res, dogId);
			}

			req.dog = dog;
			next();
		})
		.catch(next);
}

function dogNotFound(res, dogId) {
	return res.status(404).type("text").send(`No dog found with ID ${dogId}`);
}

export default router;
