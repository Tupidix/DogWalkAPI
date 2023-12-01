import express from "express";
import createError from "http-errors";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import dogsRouter from "./routes/dogs.js";
import walksRouter from "./routes/walks.js";
import mongoose from "mongoose";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost/DogWalkAPI");

const app = express();

const swaggerOptions = {
	definition: {
	  openapi: '3.0.0',
	  info: {
		title: 'Dog Walk API',
		version: 1.0,
		description: 'A simple Express API for dog walking \n If there\' a lock, you need to be authenticated to send the request',
	  },
	  components: {
		securitySchemes: {
		  bearerAuth: {
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
			description: 'Enter the token you\'ve got when you logged in here! :)',
	  		},
		},
	  },
	  servers: [
		{
		  url: 'https://dogwalkapi.onrender.com/',
		},
		],
	},
	apis: ["./routes/*.js", "./models/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/*
This middleware logger will log all HTTP requests made to the application. You do not need this information while testing (you already know that you are calling POST /users in this test).

You can conditionally omit this middleware in test mode:
 */
if (process.env.NODE_ENV !== "test") {
	app.use(logger("dev"));
}

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
