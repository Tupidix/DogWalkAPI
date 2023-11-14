import mongoose from "mongoose";
import { validateGeoJsonCoordinates } from "../utils/geo.js";

const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstname: {
		type: String,
		required: true,
		minlength: [3, "Firstname is too short"],
		maxlength: [30, "Firstname is too long"],
	},
	lastname: {
		type: String,
		required: true,
		minlength: [3, "Lastname is too short"],
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
	isAdmin: {
		type: Boolean,
		default: false,
	},
	localisation: {
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
	currentPath: { type: Schema.Types.ObjectId, ref: "Walk", default: 0 },
});

export default mongoose.model("User", userSchema);