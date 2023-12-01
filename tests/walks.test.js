import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import {
	cleanUpDatabase,
	createUserAndGetTokenAndUser,
} from "../utils/databaseoperations.js";
import User from "../models/user.js";
import Walk from "../models/walk.js";
import user from "../models/user.js";

// VIDER LA DB AVANT DE COMMENCER LES TESTS

beforeEach(async () => {
	await cleanUpDatabase();
});

describe("POST, PUT and DELETE /walks/:id", () => {
	it("should change the walk", async () => {
		// Créer un utilisateur
		const userRecu = await createUserAndGetTokenAndUser();

		const walk = await supertest(app)
			.post("/walks")
			.send({
				title: "Ma belle promenade",
				path: [
					{
						type: "Point",
						coordinate: [12.9714, 77.5946],
					},
				],
				creator: [userRecu.id],
			})
			.set("Authorization", `Bearer ${userRecu.token}`);

		// NOW WE PUT THE WALK
		const walkUpdated = await supertest(app)
			.put(`/walks/${walk.body._id}`)
			.send({
				title: "Ma magnifique promenade",
				path: [
					{
						type: "Point",
						coordinate: [12.9714, 77.5946],
					},
				],
				creator: [userRecu.id],
			})
			.set("Authorization", `Bearer ${userRecu.token}`);

		// NOW WE DELETE THE WALK
		const walkDeleted = await supertest(app)
			.delete(`/walks/${walk.body._id}`)
			.set("Authorization", `Bearer ${userRecu.token}`);
	});
});

afterAll(async () => {
	await mongoose.disconnect();
});
