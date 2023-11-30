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
 *   summary: List all dogs
 *   tags: 
 *    - dogs
 *   description: List all dogs
 *   responses:
 *    '200':
 *      description: List of dogs
*/

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

/**
 * @swagger
 * '/dogs/{id}':
 *  get:
 *   summary: 'List the details of a dog'
 *   tags: 
 *    - dogs
 *   parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      description: The dog's ID
 *      required: true
 *   responses:
 *    200:
 *     description: The dog description by id
 *    404:
 *     description: The dog was not found, this dog's ID might not exist
 *    500:
 *     description: Some error happened
 */

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

/**
 * @swagger
 * '/dogs':
 *  post:
 *   summary: 'Create a dog'
 *   tags: 
 *    - dogs
 *   requestBody:
 *    description: The dog to create
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         example: Rex
 *        birthdate:
 *         type: string
 *         format: date
 *         example: 2019-01-01
 *        breed:
 *         type: string
 *         example: Labrador
 *        master:
 *         type: string
 *         format: ObjectId
 *         example: 5f9d88a2d0b4d8f8c4b3b3f7
 *        picture:
 *         type: string
 *         example: picture.jpg
 *   responses:
 *     200:
 *       description: The dog was created
 *     404:
 *       description: The dog was not found, this dog's ID might not exist
 *     500:
 *       description: Some error happened
 */

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

/**
 * @swagger
 * '/dogs/{id}':
 *  patch:
 *    summary: 'Update certain properties of a dog'
 *    tags:
 *      - dogs
 *    parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        description: The dog's ID
 *    required: true
 *    requestBody:
 *      description: The fields to update
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name: 
 *                type: string
 *                example: Rex
 *              birthdate:
 *                type: string
 *                format: date
 *                example: 2019-01-01
 *              breed:
 *                type: string
 *                example: Labrador
 *              master:
 *                type: string
 *                format: ObjectId
 *                example: 5f9d88a2d0b4d8f8c4b3b3f7
 *              dislike:
 *                type: string
 *                format: ObjectId
 *                example: 5f9d88a2d0b4d8f8c4b3b3d7
 *              picture:
 *                type: string
 *                example: picture.jpg
 *    responses:
 *      200:
 *        description: The dog was updated
 *      404:
 *        description: The dog was not found, this dog's ID might not exist
 *      500:
 *        description: Some error happened
 */

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

/**
 * @swagger
 * '/dogs/{id}':
 *  put:
 *    summary: 'Update all properties of a dog'
 *    tags:
 *      - dogs
 *    parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        description: The dog's ID
 *    required: true
 *    requestBody:
 *      description: The fields to update
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name: 
 *                type: string
 *                example: Rex
 *              birthdate:
 *                type: string
 *                format: date
 *                example: 2019-01-01
 *              breed:
 *                type: string
 *                example: Labrador
 *              master:
 *                type: string
 *                format: ObjectId
 *                example: 5f9d88a2d0b4d8f8c4b3b3f7
 *              dislike:
 *                type: string
 *                format: ObjectId
 *                example: 5f9d88a2d0b4d8f8c4b3b3d7
 *              picture:
 *                type: string
 *                example: picture.jpg
 *    responses:
 *      200:
 *        description: The dog was updated
 *      404:
 *        description: The dog was not found, this dog's ID might not exist
 *      500:
 *        description: Some error happened
 */

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

/**
 * @swagger
 * '/dogs/{id}':
 *  delete:
 *   summary: 'Delete a dog'
 *   tags: 
 *    - dogs
 *   parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      description: The dog's ID
 *      required: true
 *   responses:
 *     200:
 *       description: The dog was deleted
 *     404:
 *       description: The dog was not found, this dog's ID might not exist
 *     500:
 *       description: Some error happened
 */

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
