import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { cleanUpDatabase } from "./utils.js";
import User from "../models/user.js";
import Walk from "../models/walk.js";

const idUser = "655ca571cfeec8f6d96ac634";
const idWalk = "655cc35a0beff0bfa6866985";

// VIDER LA DB AVANT DE COMMENCER LES TESTS
beforeEach(cleanUpDatabase);

beforeEach(async () => {
	// Créer un utilisateur
	const user = new User({
		_id: idUser,
		firstname: "John",
		lastname: "Doe",
		email: "john@john.ch",
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
		_id: idWalk,
		title: "Ma belle promenade",
		path: [
			{
				_id: "655cc35a0beff0bfa6866986",
				type: "Point",
				coordinate: [0, 0], // Exemple de coordonnées (latitude, longitude)
			},
			// Ajoutez d'autres points au besoin
		],
		creator: [idUser], // ID de l'utilisateur créateur
	});

	// Enregistrez la walk dans la base de données
	await walk.save();
});

describe("PUT and DELETE /walks/:id", () => {
	it("should change the walk", async () => {
		const updateData = {
			title: "Ma belle promenade",
			path: [
				{
					_id: "655cc35a0beff0bfa6866986",
					type: "Point",
					coordinate: [12.9714, 77.5946],
				},
			],
			creator: [idUser],
		};
		const response = await supertest(app)
			.put(`/walks/${idWalk}`)
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
					_id: "655cc35a0beff0bfa6866986",
					type: "Point",
					coordinate: [12.9714, 77.5946],
				},
			],
			creator: [idUser],
		});
	});

	it("should delete the walk", async () => {
		const walkIdToDelete = idWalk;

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
