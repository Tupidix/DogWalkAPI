import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { cleanUpDatabase } from "../utils/databaseoperations.js";

beforeEach(async () => {
	await cleanUpDatabase();
});

describe("POST /dogs", () => {
	it("should throw an error if not authenticate", async () => {
		const response = await supertest(app)
			.post("/dogs")
			.send({
				name: "Max",
				breed: "Labrador Retriever",
				birthdate: new Date(),
				picture: "mydog.jpg",
				master: "1",
			})
			.set("Accept", "application/json");

		expect(response.status).toEqual(401);

		expect(response.text).toEqual("You need to set the Authorization token");
	});
});

afterAll(async () => {
	await mongoose.disconnect();
});
