import express from "express";
import User from "../models/user.js";
import mongoose from "mongoose";
import requireJson from "../utils/requirejson.js";
import bcrypt from "bcrypt";
import * as utils from '../utils/pagination.js';

const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

/**
 * @swagger
 * /users:
 *  get:
 *   summary: List all users
 *   tags:
 *    - 'users'
 *   description: List all users
 *   responses:
 *    '200':
 *	    description: List of users
 *    '404':
 *      description: No users found
 *    '500':
 *      description: Some error happened
 */

// router.get("/", function (req, res, next) {
// 	res.send("Got a response from the users route");
// });

router.get("/", function (req, res, next) {
	
	const countQuery = queryUser(req);
	countQuery.countDocuments().then(total => {
		const { page, pageSize } = utils.getPaginationParameters(req);

		const pipeline = [];
	//Affiche tous les utilisateurs qui ont au moins un chien avec le nombre de chiens
		pipeline.push(
		{
			$lookup: {
				from: "dogs",
				localField: "_id",
				foreignField: "master",
				as: "nombreChiens",
			}
		},
		{
			$unwind: {
				path: '$nombreChiens',
				preserveNullAndEmptyArrays: true
			  }
		},
		{
			$addFields: {
			  nombreChiens: {
				$cond: {
				  if: '$nombreChiens',
				  then: 1,
				  else: 0
				}
			  }
			}
		  },
		{
			$group: {
				_id: "$_id",
				firstname: { $first: "$firstname" },
				lastname: { $first: "$lastname" },
				birthdate: { $first: "$birthdate" },
				localisation: { $first: "$localisation" },
				isAdmin: { $first: "$isAdmin" },
				nombreChiens: { $sum: { $cond: [{ $ifNull: ["$nombreChiens", false] }, 1, 0] } }
			}
		},
		{
			$sort: {
			  firstname: 1
			}
		},
		{
			$skip: (page - 1) * pageSize
		},
		{
			$limit: pageSize
		}
	);
	User.aggregate(pipeline)
	.exec()
	.then((users) => {
		utils.addLinkHeader('/users', page, pageSize, total, res);
		res.send(
			users.map(user => {
				const serialized = new User(user).toJSON();

				serialized.nombreChiens = user.nombreChiens;
				return serialized;
			})
		);
	})
	.catch(next);
	});
});

function queryUser(req) {
	let query = User.find();
	return query;
  }
/**
 * @swagger
 * /users/admin:
 *  get:
 *   summary: List all admins
 *   tags:
 *    - 'users'
 *   description: List all admins
 *   responses:
 *    '200':
 *	    description: List of users
 *    '404':
 *      description: No users found
 *    '500':
 *      description: Some error happened
 */

/* GET users listing. */
router.get("/admin", function (req, res, next) {
	//affiche que les admins
	const query = {isAdmin: true};
	User.find(query)
        .sort("firstname")
        .exec()
        .then((users) => {
            res.send(users);
        })
        .catch((err) => {
            next(err);
        });
});

/**
 * @swagger
 * /users/{id}:
 *  get:
 *   summary: 'List the details of a user'
 *   tags:
 *    - 'users'
 *   parameters:
 *   - in: path
 *     name: id
 *     type: string
 *     description: The user's ID
 *     required: true
 *   responses:
 *    200:
 *     description: The user description by id
 *    404:
 *     description: The user was not found, this user's ID might not exist
 *    500:
 *     description: Some error happened
 */

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

/**
 * @swagger
 * /users:
 *  post:
 *   summary: 'Create a user'
 *   tags: 
 *    - users
 *   requestBody:
 *    description: The user to create
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        firstname:
 *         type: string
 *         description: The user's firstname.
 *         example: John
 *        lastname:
 *         type: string
 *         description: The user's lastname.
 *         example: Doe
 *        email:
 *         type: string
 *         description: The user's email.
 *         example: 'john@doe.ch'
 *        password:
 *         type: string
 *         description: The user's password.
 *         example: password
 *        birthdate:
 *         type: string
 *         format: date
 *         description: The user's birthdate.
 *         example: 2019-01-01
 *        picture:
 *         type: string
 *         description: The user's picture.
 *         example: picture.jpg
 *        isAdmin:
 *         type: boolean
 *         description: The user's admin status.
 *         example: false
 *        localisation:
 *         type: array
 *         example: [0,0]
 *        currentPath:
 *          type: string
 *          format: ObjectId
 *          example: 5f9d88a2d0b4d8f8c4b3b3f7
 *   required:
 *    - firstname
 *    - lastname
 *    - email
 *    - password
 *    - birthdate
 *    - picture
 *    - isAdmin
 *    - localisation
 *    - currentPath
 *   responses:
 *     200:
 *       description: The dog was created
 *     404:
 *       description: The dog was not found, this dog's ID might not exist
 *     500:
 *       description: Some error happened
 */

router.post("/", async (req, res, next) => {
	try {
        // Hachez le mot de passe avant de créer l'utilisateur
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Créez un nouvel utilisateur avec le mot de passe haché
        const newUser = new User({
            firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			password: hashedPassword,
			birthdate: req.body.birthdate,
			picture: req.body.picture,
			isAdmin: req.body.isAdmin,
			localisation: req.body.localisation,
			currentPath: req.body.currentPath,
        });

        // Enregistrez le nouvel utilisateur
        const savedUser = await newUser.save();

        // Envoyez la réponse avec l'utilisateur sauvegardé
        res.send(savedUser);
    } catch (err) {
        next(err);
    }
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

		if (req.body.picture !== undefined) {
			req.user.picture = req.body.picture;
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

router.patch("/:id/join/:walkId", loadUserFromParamsMiddleware, (req, res, next) => {
	req.user.currentPath = req.params.walkId;
	req.user
		.save()
		.then((savedUser) => {
			res.send(savedUser);
		})
		.catch(next);
});

router.patch("/:id/leave", loadUserFromParamsMiddleware, (req, res, next) => {
	req.user.currentPath = null;
	req.user
		.save()
		.then((savedUser) => {
			res.send(savedUser);
		})
		.catch(next);
});

router.put(
	"/:id",
	requireJson,
	loadUserFromParamsMiddleware,
	(req, res, next) => {
		// Update all properties (regardless of whether the are present in the request body or not)

		req.user.firstname = req.body.firstname;
		req.user.lastname = req.body.lastname;
		req.user.email = req.body.email;
		req.user.password = req.body.password;
		req.user.birthdate = req.body.birthdate;
		req.user.picture = req.body.picture;
		req.user.isAdmin = req.body.isAdmin;
		req.user.localisation = req.body.localisation;
		req.user.currentPath = req.body.currentPath;

		req.user
			.save()
			.then((savedUser) => {
				//debug(`Updated user "${savedUser.firstname} ${savedUser.lastname}"`);
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
