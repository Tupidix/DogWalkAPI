import express from "express";
import Walk from "../models/walk.js";
import mongoose from "mongoose";
import requireJson from "../utils/requirejson.js";
import { broadcastMessage } from "../messaging.js";
import { authenticate } from "../utils/authenticate.js";

const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

// router.get("/", function (req, res, next) {
// 	res.send("Got a response from the walks route");
// });

/**
 * @swagger
 * /walks:
 *  get:
 *   summary: List all walks
 *   tags:
 *    - 'walks'
 *   description: List all walks
 *   responses:
 *    '200':
 *      description: List of walks
 *    '401':
 *      description: You need to be authenticated to do that
 *    '404':
 *      description: No walk found
 *    '500':
 *      description: Some error happened
 */

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

/**
 * @swagger
 * /walks/{id}:
 *  get:
 *   summary: 'List the details of a walk'
 *   tags:
 *    - 'walks'
 *   parameters:
 *   - in: path
 *     name: id
 *     type: string
 *     description: The walk's ID
 *     required: true
 *   responses:
 *    200:
 *     description: The walk description by id
 *    '401':
 *      description: You need to be authenticated to do that
 *    404:
 *     description: The walk was not found, this walk's ID might not exist
 *    500:
 *     description: Some error happened
 */

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

/**
 * @swagger
 * /walks:
 *  post:
 *   summary: Create a walk
 *   tags:
 *    - 'walks'
 *   description: Create a walk
 *   requestBody:
 *      description: The fields to update
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                example: Walk 1
 *              path:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    type:
 *                      type: string
 *                      enum: Point
 *                    coordinate:
 *                      type: array
 *                      items:
 *                        type: number
 *                        description: The walk's path.
 *              creator:
 *                type: string
 *                format: ObjectId
 *                example: 5f9d88a2d0b4d8f8c4b3b3f7

 *   responses:
 *    '200':
 *      description: List of walks
 *    '401':
 *      description: You need to be authenticated to do that
 *    '404':
 *      description: No walk found
 *    '500':
 *      description: Some error happened
 */

/* POST new walk */
router.post("/", authenticate, (req, res, next) => {
	// Create a new document from the JSON in the request body
	const newWalk = new Walk(req.body);
	// Save that document
	newWalk
		.save()
		.then((savedWalk) => {
			broadcastMessage({ message: "Une balade a été créée proche de vous.", title: savedWalk.title });
			// Send the saved document in the response
			res.send(savedWalk);
		})
		.catch((err) => {
			next(err);
		});
});

/**
 * @swagger
 * '/walks/{id}':
 *  patch:
 *    summary: 'Update certain properties of a walk'
 *    tags:
 *      - walks
 *    parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        description: The walk's ID
 *    required: true
 *    requestBody:
 *      description: The fields to update
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                example: Walk 1
 *              path:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    type:
 *                      type: string
 *                      enum: Point
 *                    coordinate:
 *                      type: array
 *                      items:
 *                        type: number
 *                        description: The walk's path.
 *              creator:
 *                type: string
 *                format: ObjectId
 *                example: 5f9d88a2d0b4d8f8c4b3b3f7
 *        
 *    responses:
 *      200:
 *        description: The walk was updated
 *      401:
 *        description: You need to be authenticated to do that
 *      404:
 *        description: The walk was not found, this walk's ID might not exist
 *      500:
 *        description: Some error happened
 */


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

/**
 * @swagger
 * '/walks/{id}':
 *  put:
 *    summary: 'Update all properties of a walk'
 *    tags:
 *      - walks
 *    parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        description: The walk's ID
 *    required: true
 *    requestBody:
 *      description: The fields to update
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                example: Walk 1
 *              path:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    type:
 *                      type: string
 *                      enum: Point
 *                    coordinate:
 *                      type: array
 *                      items:
 *                        type: number
 *                        description: The walk's path.
 *              creator:
 *                type: string
 *                format: ObjectId
 *                example: 5f9d88a2d0b4d8f8c4b3b3f7
 *        
 *    responses:
 *      200:
 *        description: The walk was updated
 *      401:
 *        description: You need to be authenticated to do that
 *      404:
 *        description: The walk was not found, this walk's ID might not exist
 *      500:
 *        description: Some error happened
 */


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

/**
 * @swagger
 * /walks/{id}:
 *  delete:
 *   summary: Delete a walk
 *   tags:
 *    - 'walks'
 *   description: Delete a walk
 *   parameters:
 *   - in: path
 *     name: id
 *     type: string
 *     description: The walk's ID
 *     required: true
 *   responses:
 *    '204':
 *     description: The walk was deleted
 *    '401':
 *     description: You need to be authenticated to do that
 *    '404':
 *     description: The walk was not found, this walk's ID might not exist
 *    '500':
 *     description: Some error happened 
 */

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