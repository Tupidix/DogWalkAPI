import express from "express";
import Dog from "../models/dog.js";
import mongoose from "mongoose";
import requireJson from "../utils/requirejson.js";
import { authenticate } from "../utils/authenticate.js";

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
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    '200':
 *      description: List of all dogs
 *    '404':
 *      description: No dogs found
 *    '500':
 *     description: Some error happened
 */

router.get("/", authenticate, function (req, res, next) {
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
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      description: The dog's ID
 *      required: true
 *   responses:
 *    200:
 *     description: The dog's details by id
 *    404:
 *     description: The dog was not found, this dogs might not exist
 *    500:
 *     description: Some error happened
 */

router.get(
  "/:id",
  authenticate,
  loadDogFromParamsMiddlewareForGet,
  (req, res, next) => {
    Dog.findById(req.params.id)
      .exec()
      .then((dogs) => {
        res.send(dogs);
      })
      .catch((err) => {
        next(err);
      });
  }
);

/**
 * @swagger
 * '/dogs':
 *  post:
 *   summary: 'Create a dog'
 *   tags:
 *    - dogs
 *   security:
 *    - bearerAuth: []
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
 *      200:
 *        description: The dog was updated
 *      401:
 *        description: You need to be authenticated to do that
 *      403:
 *       description: You are not the master of this dog
 *      500:
 *        description: Some error happened
 */

router.post("/", authenticate, (req, res, next) => {
  // Create a new document from the JSON in the request body
  const newDog = new Dog(req.body);
  // Save that document
  newDog
    .save()
    .then((savedDog) => {
      // Send the saved document in the response
      if (req.currentUserId !== savedDog.master.toString()) {
        return res
          .status(403)
          .send("You must set yourself as the master of this dog");
      }
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
 *    security:
 *      - bearerAuth: []
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
 *      403:
 *       description: You are not the master of this dog
 *      404:
 *        description: The dog was not found, this dog's ID might not exist
 *      500:
 *        description: Some error happened
 */

router.patch(
  "/:id",
  requireJson,
  authenticate,
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
 *    security:
 *      - bearerAuth: []
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
 *      403:
 *       description: You are not the master of this dog
 *      404:
 *        description: The dog was not found, this dog's ID might not exist
 *      500:
 *        description: Some error happened
 *      501:
 *        description: Missing required field(s)
 */

router.put(
  "/:id",
  requireJson,
  authenticate,
  loadDogFromParamsMiddleware,
  (req, res, next) => {
    // Update all properties

    req.dog.name = req.body.name;
    req.dog.birthdate = req.body.birthdate;
    req.dog.breed = req.body.breed;
    req.dog.master = req.body.master;
    req.dog.dislike = req.body.dislike;
    req.dog.picture = req.body.picture;

    // if it miss a required property, abort and send a 501 error
    if (
      !req.dog.name ||
      !req.dog.birthdate ||
      !req.dog.breed ||
      !req.dog.master ||
      !req.dog.picture
    ) {
      return res
        .status(501)
        .send(
          "Missing required fields (name, birthdate, breed, master, dislike or picture)"
        );
    }

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
 *   security:
 *    - bearerAuth: []
 *   responses:
 *     204:
 *       description: The dog was deleted
 *     403:
 *      description: You are not the master of this dog
 *     404:
 *       description: The dog was not found, this dog's ID might not exist
 *     500:
 *       description: Some error happened
 */

router.delete(
  "/:id",
  authenticate,
  loadDogFromParamsMiddleware,
  (req, res, next) => {
    req.dog
      .deleteOne()
      .then(() => {
        res.sendStatus(204).send("The dog was deleted");
      })
      .catch(next);
  }
);

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
      if (req.currentUserId !== dog.master.toString()) {
        return res.status(403).send("You are not the owner of this dog");
      }

      req.dog = dog;
      next();
    })
    .catch(next);
}

function loadDogFromParamsMiddlewareForGet(req, res, next) {
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
