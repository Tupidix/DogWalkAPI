import mongoose from "mongoose";
import { validateGeoJsonCoordinates } from "../utils/geo.js";

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
	creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Walk", walkSchema);
