import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { cleanUpDatabase } from "./utils.js";
import User from "../models/user.js";

// VIDER LA DB AVANT DE COMMENCER LES TESTS
beforeEach(cleanUpDatabase);

const date1 = new Date();
const date2 = new Date();

beforeEach(async () => {
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
});

// Assurez-vous que la réponse contient les utilisateurs créés
describe("GET /users", () => {
	it("should retrieve the list of users", async () => {
		const response = await supertest(app).get("/users");

		// Assurez-vous que la réponse a le code 200 (OK)
		expect(response.status).toBe(200);

		// Assurez-vous que la réponse est au format JSON
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body).toEqual([
			{
				__v: 0,
				_id: expect.any(String),
				firstname: "Jane",
				lastname: "Doe",
				email: "jane@jane.ch",
				password: "12345678",
				birthdate: date2.toISOString(),
				isAdmin: false,
				picture: "jane-doe.jpg",
				localisation: {
					type: "Point",
					coordinate: [46.519653, 6.632273],
				},
			},
			{
				__v: 0,
				_id: expect.any(String),
				firstname: "John",
				lastname: "Doe",
				email: "john@john.ch",
				password: "12345678",
				birthdate: date1.toISOString(),
				isAdmin: false,
				picture: "john-doe.jpg",
				localisation: {
					type: "Point",
					coordinate: [46.519653, 6.632273],
				},
			},
		]);
	});
});

afterAll(async () => {
	await mongoose.disconnect();
});
