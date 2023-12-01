import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { cleanUpDatabase } from "../utils/databaseoperations.js";
import User from "../models/user.js";
import { createUserAndGetTokenAndUser } from "../utils/databaseoperations.js";

// VIDER LA DB AVANT DE COMMENCER LES TESTS

const date1 = new Date().toISOString(); // On s'assure que la date est au format ISO
const date2 = new Date().toISOString(); // On s'assure que la date est au format ISO

// Avant de commencer chaque test, on vide la base de données
beforeEach(async () => {
	await cleanUpDatabase();
});

describe("GET /users", () => {
	it("should retrieve the list of users", async () => {
		// Créer un utilisateur qui aura le token

		const userRecu = await createUserAndGetTokenAndUser();

		const userAuth = await supertest(app)
			.get("/users")
			.set("Authorization", `Bearer ${userRecu.token}`)
			.expect(200)
			.expect("Content-Type", /json/);
		// On s'assure que la requête a réussi
		expect(userAuth.status).toBe(200);

		// On s'assure que la réponse est bien du JSON
		expect(userAuth.headers["content-type"]).toMatch(/json/);

		// On s'assure que la réponse contient bien les utilisateurs créés
		expect(userAuth.body).toEqual([
			{
				// __v: expect.any(Number),
				_id: expect.any(String),
				firstname: "Prof",
				lastname: "Prof",
				birthdate: new Date("2023-12-01").toISOString(),
				isAdmin: false,
				picture: "prof.jpg",
				localisation: {
					type: "Point",
					coordinate: [46.519653, 6.632273],
				},
				nombreChiens: 0,
			},
		]);
	});
});

afterAll(async () => {
	await mongoose.disconnect();
});
