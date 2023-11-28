import express from "express";
import Dog from "../models/dog.js";
import mongoose from "mongoose";
import requireJson from "../utils/requirejson.js";

const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

// router.get("/", function (req, res, next) {
// 	res.send("Got a response from the dogs route");
// });

/**
 * @swagger
 * /dogs:
 *  get:
 *   summary: Get all dogs
 *   description: Get all dogs
 *   responses:
 *    '200':
 *      description: List of dogs
*/

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

router.patch(
	"/:id",
	requireJson,
	loadDogFromParamsMiddleware,
	(req, res, next) => {
		// Update only properties present in the request body
		if (req.body.name !== undefined) {
			req.dog.name = req.body.name;
		}

		if (req.body.birthdate !== undefined) {
			req.dog.birthdate = req.body.birthdate;
		}

		if (req.body.breed !== undefined) {
			req.dog.breed = req.body.breed;
		}

		if (req.body.master !== undefined) {
			req.dog.master = req.body.master;
		}

		if (req.body.dislike !== undefined) {
			req.dog.dislike = req.body.dislike;
		}

		if (req.body.picture !== undefined) {
			req.dog.picture = req.body.picture;
		}

		req.dog
			.save()
			.then((savedDog) => {
				// debug(`Updated dog "${savedDog.name}"`);
				res.send(savedDog);
			})
			.catch(next);
	}
);

router.put(
	"/:id",
	requireJson,
	loadDogFromParamsMiddleware,
	(req, res, next) => {
		// Update all properties (regardless of whether the are present in the request body or not)

		req.dog.name = req.body.name;
		req.dog.birthdate = req.body.birthdate;
		req.dog.breed = req.body.breed;
		req.dog.master = req.body.master;
		req.dog.dislike = req.body.dislike;
		req.dog.picture = req.body.picture;

		req.dog
			.save()
			.then((savedDog) => {
				//debug(`Updated dog "${savedDog.name}"`);
				res.send(savedDog);
			})
			.catch(next);
	}
);

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
