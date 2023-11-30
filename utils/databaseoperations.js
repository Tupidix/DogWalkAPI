import User from "../models/user.js";
import Dog from "../models/dog.js";
import Walk from "../models/walk.js";

export const cleanUpDatabase = async function () {
	await Promise.all([User.deleteMany(), Dog.deleteMany(), Walk.deleteMany()]);
};
