import User from "../models/user.js";
import Dog from "../models/dog.js";
import Walk from "../models/walk.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import supertest from "supertest";
import app from "../app.js";

const signJwt = promisify(jwt.sign);

export const cleanUpDatabase = async function () {
	await Promise.all([User.deleteMany(), Dog.deleteMany(), Walk.deleteMany()]);
};

export async function generateValidJwt(user) {
	const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;
	const claims = { _id: user._id, exp: exp };
	return await signJwt(claims, "secret");
}

export async function createUserAndGetTokenAndUser() {
	const user = await supertest(app)
		.post("/users")
		.send({
			firstname: "Prof",
			lastname: "Prof",
			email: "prof@prof.ch",
			password: "TheTeacher123",
			birthdate: new Date("2023-12-01").toISOString(),
			picture: "prof.jpg",
			localisation: {
				type: "Point",
				coordinate: [46.519653, 6.632273],
			},
		});

	// // Connexion avec le user fraichement créé pour récupérer le token
	await supertest(app).post("/login").send({
		email: "prof@prof.ch",
		password: "TheTeacher123",
	});

	// Récupération du token
	// On test qu'on arrive à GET les USER avec le token
	const token = await generateValidJwt(user);

	// Get the user ID
	const userRecu = await supertest(app)
		.get("/users")
		.set("Authorization", `Bearer ${token}`)
		.expect(200)
		.expect("Content-Type", /json/);

	return {
		token: token,
		id: userRecu.body[0]._id.toString(),
	};
}
