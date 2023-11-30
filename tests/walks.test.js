import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { cleanUpDatabase } from "../utils/databaseoperations.js";
import User from "../models/user.js";
import Walk from "../models/walk.js";

// VIDER LA DB AVANT DE COMMENCER LES TESTS

beforeEach(async () => {
	await cleanUpDatabase();
});

describe("PUT and DELETE /walks/:id", () => {
	it("should change the walk", async () => {
		// Créer un utilisateur
		const user = new User({
			firstname: "Patrick",
			lastname: "Marques",
			email: "pat@pat.ch",
			password: "12345678",
			birthdate: new Date("1997-10-24"),
			picture: "john-doe.jpg",
			localisation: {
				type: "Point",
				coordinate: [46.519653, 6.632273],
			},
		});

		// Enregistrez l'utilisateur dans la base de données
		await user.save();

		// Créer une walk selon le modèle
		const walk = new Walk({
			title: "Ma belle promenade",
			path: [
				{
					type: "Point",
					coordinate: [0, 0], // Exemple de coordonnées (latitude, longitude)
				},
				// Ajoutez d'autres points au besoin
			],
			// récupération de l'id de l'utilisateur créateur
			creator: [user.id],
		});

		// Enregistrez la walk dans la base de données
		await walk.save();

		const updateData = {
			title: "Ma belle promenade",
			path: [
				{
					type: "Point",
					coordinate: [12.9714, 77.5946],
				},
			],
			creator: [user.id],
		};
		const response = await supertest(app)
			.put(`/walks/${walk.id}`)
			.send(updateData);

		// Vérification de la réponse de suppression
		expect(response.status).toBe(200);

		// Assurez-vous que la réponse contient les utilisateurs créés
		expect(response.body).toEqual({
			__v: expect.any(Number),
			_id: expect.any(String),
			title: "Ma belle promenade",
			path: [
				{
					_id: expect.any(String),
					type: "Point",
					coordinate: [12.9714, 77.5946],
				},
			],
			creator: user.id,
		});

		const walkIdToDelete = walk.id;

		// Suppression de la promenade
		const deleteResponse = await supertest(app).delete(
			`/walks/${walkIdToDelete}`
		);

		// Vérification de la réponse de suppression
		expect(deleteResponse.status).toBe(204);

		// Recherche de la promenade après la suppression
		const findAfterDelete = await Walk.findById(walkIdToDelete);

		// Vérification que la promenade a bien été supprimée
		expect(findAfterDelete).toBeNull();
	});
});

afterAll(async () => {
	await mongoose.disconnect();
});
