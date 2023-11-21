import express from "express";
import Walk from "../models/walk.js";
import mongoose from "mongoose";

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
