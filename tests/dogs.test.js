import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";

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

		expect(response.text).toEqual("Authorization header is missing");
	});
});

afterAll(async () => {
	await mongoose.disconnect();
});
