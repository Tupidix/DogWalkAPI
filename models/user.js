import mongoose from "mongoose";
import { validateGeoJsonCoordinates } from "../utils/geo.js";

/**
 * @swagger
 * component:
 *  schemas:
 *    Users:
 *      type: object
 *      properties:
 *         firstname:
 *           type: string
 *           description: The user's firstname.
 *         lastname:
 *           type: string
 *           description: The user's lastname.
 *         email:
 *           type: string
 *           description: The user's email.
 *         password:
 *           type: string
 *           description: The user's password.
 *         birthdate:
 *           type: string
 *           format: date
 *         picture:
 *           type: string
 *           description: The user's picture.
 *         isAdmin:
 *           type: boolean
 *           description: The user's admin status.
 *         localisation:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: Point
 *             coordinate:
 *               type: array
 *               items:
 *                 type: number
 *           description: The user's localisation.
 *         currentPath:
 *           type: string
 *           format: ObjectId
 * 
 *         required:
 *           - firstname
 *           - lastname
 *           - email
 *           - password
 *           - birthdate
 *           - picture
 *           - isAdmin
 *           - localisation
 *           - currentPath
 * 
 *         example:
 *           firstname: John
 *           lastname: Doe
 *           email: 'john@doe.ch'
 *           password: password
 *           birthdate: 2019-01-01
 *           picture: picture.jpg
 *           isAdmin: false
 *           localisation:
 *             type: Point
 *             coordinate: [0, 0]
 *           currentPath: 5f9d88a2d0b4d8f8c4b3b3f7
 */

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        minlength: [2, "Firstname is too short"],
        maxlength: [30, "Firstname is too long"],
    },
    lastname: {
        type: String,
        required: true,
        minlength: [2, "Lastname is too short"],
        maxlength: [30, "Lastname is too long"],
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password is too short"],
    },
    birthdate: {
        type: Date,
        required: true,
    },
    picture: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    localisation: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinate: {
            type: [Number],
            validate: {
                validator: validateGeoJsonCoordinates,
                message: "Path coordinates must be an array of two numbers",
            },
        },
    },
    currentPath: {
		type: Schema.Types.ObjectId,
		ref: "Walk",
		validate: {
			validator: async function (value) {
				const walk = await mongoose.model("Walk").findOne({ _id: value }).exec();
				if (!walk) {

					if(value === null) {
						return true;
					}
					throw new Error(`This walk doesn't exist: ${value}`);
				}

				return true; // Le l'ID du user existe
			},
		},
	},});

export default mongoose.model("User", userSchema);
