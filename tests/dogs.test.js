import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";

describe("POST /dogs", () => {
	it("should throw an error if master is missing", async () => {
		const response = await supertest(app)
			.post("/dogs")
			.send({
				name: "Max",
				breed: "Labrador Retriever",
				birthdate: new Date(),
				picture: "mydog.jpg",
			})
			.set("Accept", "application/json");

		expect(response.text).toEqual(
			"Dog validation failed: master: You must have at least one master"
		);
	});

	it("should throw an error if master has non-existing user", async () => {
		const response = await supertest(app)
			.post("/dogs")
			.send({
				name: "Max",
				breed: "Labrador Retriever",
				birthdate: new Date(),
				picture: "mydog.jpg",
				master: ["non-existing-user-id"],
			})
			.set("Accept", "application/json");

		expect(response.status).toBe(500);
	});
});

afterAll(async () => {
	await mongoose.disconnect();
});
