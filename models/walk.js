import mongoose from "mongoose";
import { validateGeoJsonCoordinates } from "../utils/geo.js";

/**
 * @swagger
 * component:
 *   schemas:
 *   Walk:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *         description: The walk's title.
 *       path:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             type:            
 *               type: string
 *               enum: Point
 *             coordinate:
 *               type: array
 *               items:
 *                 type: number
 *                 description: The walk's path.
 *       creator:
 *         type: array
 *         items:
 *           type: string
 *           format: ObjectId
 *           description: The walk's creator.
 *     required:
 *       - title
 *       - path
 *       - creator
 *     example:
 *       title: Walk 1
 *       path: [{"type":"Point","coordinate":[0,0]}]
 *       creator: 5f9d88a2d0b4d8f8c4b3b3f7
 */

const Schema = mongoose.Schema;

const walkSchema = new Schema({
	title: {
		type: String,
		required: true,
		minlength: [3, "Walk name is too short"],
		maxlength: [40, "Walk name is too long"],
	},
	path: [
		{
			type: {
				type: String,
				required: true,
				enum: ["Point"],
			},
			coordinate: {
				type: [Number],
				required: true,
				validate: {
					validator: validateGeoJsonCoordinates,
					message: "Path coordinates must be an array of two numbers",
				},
			},
		},
	],
	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
		validate: {
			validator: async function (value) {

				const user = await mongoose.model("User").findOne({ _id: value }).exec();
				if (!user) {
					throw new Error(`This user doesn't exist: ${value}`);
				}

				return true; // Le l'ID du user existe
			},
		},
	},
});

export default mongoose.model("Walk", walkSchema);
