import express from "express";
import createError from "http-errors";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import dogsRouter from "./routes/dogs.js";
import walksRouter from "./routes/walks.js";
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/DogWalkAPI");

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
	dogList: [{ type: Schema.Types.ObjectId, ref: "Dog" }],
	currentPath: { type: Schema.Types.ObjectId, ref: "Walk", default: 0 },
});

mongoose.model("User", userSchema);

const dogSchema = new Schema({
	name: {
		type: String,
		required: true,
		minlength: [3, "Dog name is too short"],
		maxlength: [20, "Dog name is too long"],
	},
	birthdate: {
		type: Date,
		required: true,
	},
	breed: {
		type: String,
		required: true,
		minlength: [3, "Dog breed is too short"],
		maxlength: [40, "Dog breed is too long"],
	},
	master: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
	dislike: [{ type: Schema.Types.ObjectId, ref: "Dog" }],
	picture: { type: String, required: true },
});

mongoose.model("Dog", dogSchema);

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

// Validate a GeoJSON coordinates array (longitude, latitude and optional altitude).
function validateGeoJsonCoordinates(value) {
	return (
		Array.isArray(value) &&
		value.length >= 2 &&
		value.length <= 3 &&
		isLongitude(value[0]) &&
		isLatitude(value[1])
	);
}

function isLatitude(value) {
	return value >= -90 && value <= 90;
}

function isLongitude(value) {
	return value >= -180 && value <= 180;
}

mongoose.model("Walk", walkSchema);

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dogs", dogsRouter);
app.use("/walks", walksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// Send the error status
	res.status(err.status || 500);
	res.send(err.message);
});

export default app;
