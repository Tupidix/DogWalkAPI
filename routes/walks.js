import express from "express";
import Walk from "../models/walk.js";
import mongoose from "mongoose";
import requireJson from "../utils/requirejson.js";

const ObjectId = mongoose.Types.ObjectId;

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

router.get("/:id", (req, res, next) => {
	Walk.findById(req.params.id)
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

router.patch(
	"/:id",
	requireJson,
	loadWalkFromParamsMiddleware,
	(req, res, next) => {
		// Update only properties present in the request body
		if (req.body.title !== undefined) {
			req.walk.title = req.body.title;
		}

		if (req.body.path !== undefined) {
			req.walk.path = req.body.path;
		}

		if (req.body.creator !== undefined) {
			req.walk.creator = req.body.creator;
		}

		req.walk
			.save()
			.then((savedWalk) => {
				// 	debug(`Updated walk "${savedWalk.title}"`);
				res.send(savedWalk);
			})
			.catch(next);
	}
);

router.put(
	"/:id",
	requireJson,
	loadWalkFromParamsMiddleware,
	(req, res, next) => {
		// Update all properties (regardless of whether the are present in the request body or not)

		req.walk.title = req.body.title;
		req.walk.path = req.body.path;
		req.walk.creator = req.body.creator;

		req.walk
			.save()
			.then((savedWalk) => {
				//debug(`Updated walk "${savedWalk.title}"`);
				res.send(savedWalk);
			})
			.catch(next);
	}
);

router.delete("/:id", loadWalkFromParamsMiddleware, (req, res, next) => {
	req.walk
		.deleteOne()
		.then(() => {
			res.sendStatus(204);
		})
		.catch(next);
});

function loadWalkFromParamsMiddleware(req, res, next) {
	const walkId = req.params.id;
	if (!ObjectId.isValid(walkId)) {
		return walkNotFound(res, walkId);
	}

	let query = Walk.findById(walkId);

	query
		.exec()
		.then((walk) => {
			if (!walk) {
				return walkNotFound(res, walkId);
			}

			req.walk = walk;
			next();
		})
		.catch(next);
}

function walkNotFound(res, walkId) {
	return res.status(404).type("text").send(`No walk found with ID ${walkId}`);
}

export default router;
