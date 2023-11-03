import express from "express";
import createError from "http-errors";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/DogWalkAPI');

const Schema = mongoose.Schema;

const userSchema = new Schema  ({
username: String,
firstname: String,
lastname: String,
email: String,
password: String,
birthdate: Date,
isAdmin: {type: Boolean, default: false},
localisation: {
  type: {type: String},
  coordinates: [],
},
dogList: [{type: Schema.Types.ObjectId, ref: 'Dog'}],
currentPath: {type: Schema.Types.ObjectId, ref: 'Walk', default: 0},
});

mongoose.model('User', userSchema);

const dogSchema = new Schema  ({
  name: String,
  birthdate: Date,
  breed: String,
  master: [{type: Schema.Types.ObjectId, ref: 'User'}],
  dislike: [{type: Schema.Types.ObjectId, ref: 'Dog'}],
  picture: {type: String},
});

mongoose.model('Dog', dogSchema);

const walkSchema = new Schema  ({
title: String,
path: {
  type: {type: String},
  coordinates: [],
},
creator: {type: Schema.Types.ObjectId, ref: 'User'},
});

mongoose.model('Walk', walkSchema);

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", usersRouter);

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
