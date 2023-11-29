import express from "express";
import User from "../models/user.js";
import mongoose from "mongoose";
import requireJson from "../utils/requirejson.js";
import bcrypt from "bcrypt";

const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

// router.get("/", function (req, res, next) {
// 	res.send("Got a response from the users route");
// });
router.get("/", function (req, res, next) {
	
	//Affiche tous les utilisateurs qui ont au moins un chien avec le nombre de chiens
	User.aggregate([
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
		}
	])
	.exec()
	.then((users) => {
		res.send(users);
	})
	.catch((err) => {
		next(err);
	});
});

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
