import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import {
	cleanUpDatabase,
	generateValidJwt,
	createUserAndGetTokenAndUser,
} from "../utils/databaseoperations.js";
import user from "../models/user.js";

// Authentification
beforeEach(async () => {
	await cleanUpDatabase();
});

describe("POST /dogs", () => {
	it("should refuse to create a dog because the master is missing", async function () {
		const naissanceChien = new Date().toISOString();

		// Create a user and get the token
		const userRecu = await createUserAndGetTokenAndUser();

		// On test qu'on arrive à POST un chien avec le token
		// Mais on arrivera pas à POST un chien car il faut un master
		const response = await supertest(app)
			.post("/dogs")
			.send({
				name: "Max",
				breed: "Labrador Retriever",
				birthdate: naissanceChien,
				picture: "mydog.jpg",
			})
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${userRecu.token}`);

		expect(response.status).toEqual(500);

		expect(response.text).toEqual(
			"Dog validation failed: master: You must have at least one master"
		);
	});
});

afterAll(async () => {
	await mongoose.disconnect();
});
