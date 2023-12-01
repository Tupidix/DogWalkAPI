import User from "../models/user.js";
import Dog from "../models/dog.js";
import Walk from "../models/walk.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const signJwt = promisify(jwt.sign);

export const cleanUpDatabase = async function () {
	await Promise.all([User.deleteMany(), Dog.deleteMany(), Walk.deleteMany()]);
};

export async function generateValidJwt(user) {
	const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;
	const claims = { _id: user._id.toString(), exp: exp };
	return await signJwt(claims, process.env.JWT_SECRET);
  }