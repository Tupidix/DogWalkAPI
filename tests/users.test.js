import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { cleanUpDatabase } from "../utils/databaseoperations.js";
import User from "../models/user.js";

// VIDER LA DB AVANT DE COMMENCER LES TESTS

const date1 = new Date().toISOString(); // On s'assure que la date est au format ISO
const date2 = new Date().toISOString(); // On s'assure que la date est au format ISO

// Avant de commencer chaque test, on vide la base de données
beforeEach(async () => {
	await cleanUpDatabase();
});

describe("GET /users", () => {
	it("should retrieve the list of users", async () => {
		// Créer un utilisateur
		const user = new User({
			firstname: "John",
			lastname: "Doe",
			email: "john@john.ch",
			password: "12345678",
			birthdate: date1,
			picture: "john-doe.jpg",
			localisation: {
				type: "Point",
				coordinate: [46.519653, 6.632273],
			},
		});

		// Créer un autre utilisateur
		const user2 = new User({
			firstname: "Jane",
			lastname: "Doe",
			email: "jane@jane.ch",
			password: "12345678",
			birthdate: date2,
			picture: "jane-doe.jpg",
			localisation: {
				type: "Point",
				coordinate: [46.519653, 6.632273],
			},
		});

		// Enregistrez les utilisateurs dans la base de données
		await user.save();
		await user2.save();

		// Faites une requête GET à l'API
		const response = await supertest(app).get("/users");

		// On s'assure que la requête a réussi
		expect(response.status).toBe(200);

		// On s'assure que la réponse est bien du JSON
		expect(response.headers["content-type"]).toMatch(/json/);

		// On s'assure que la réponse contient bien les utilisateurs créés
		expect(response.body).toEqual([
			{
				// __v: expect.any(Number),
				_id: expect.any(String),
				firstname: "Jane",
				lastname: "Doe",
				birthdate: date2,
				isAdmin: false,
				picture: "jane-doe.jpg",
				localisation: {
					type: "Point",
					coordinate: [46.519653, 6.632273],
				},
				nombreChiens: 0,
			},
			{
				// __v: expect.any(Number),
				_id: expect.any(String),
				firstname: "John",
				lastname: "Doe",
				birthdate: date1,
				isAdmin: false,
				picture: "john-doe.jpg",
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
