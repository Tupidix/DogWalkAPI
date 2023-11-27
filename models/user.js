import mongoose from "mongoose";
import { validateGeoJsonCoordinates } from "../utils/geo.js";

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
	currentPath: { type: Schema.Types.ObjectId, ref: "Walk" },
});

export default mongoose.model("User", userSchema);
