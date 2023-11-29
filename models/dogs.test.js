import Dog from "./dog.js";

// describe("Dog Model", () => {
// 	it("Create a new dog instance if its complete", async () => {
// 		await expect(async () => {
// 			const dog = new Dog({
// 				name: "Max",
// 				breed: "Labrador Retriever",
// 				birthdate: new Date(),
// 				picture: "url_de_l_image",
// 				master: ["5f8f5f7f7f7f7f7f7f7f7f7f"],
// 			});
// 			dog.validate(); // Cette ligne est ajoutée pour déclencher la validation
// 		}).not.toThrow();
// 	});
// });

describe("Dog Model", () => {
	it("should throw an error if master is missing", async () => {
		await expect(async () => {
			const dog = new Dog({
				name: "Max",
				breed: "Labrador Retriever",
				birthdate: new Date(),
				picture: "url_de_l_image",
			});
			await dog.validate(); // Cette ligne est ajoutée pour déclencher la validation
		}).rejects.toThrow(
			"Dog validation failed: master: You must have at least one master"
		);
	});
});

// const {MongoClient} = require('mongodb');

// describe('insert', () => {
//   let connection;
//   let db;

//   beforeAll(async () => {
//     connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     db = await connection.db(globalThis.__MONGO_DB_NAME__);
//   });

//   afterAll(async () => {
//     await connection.close();
//   });

//   it('should insert a doc into collection', async () => {
//     const users = db.collection('users');

//     const mockUser = {_id: 'some-user-id', name: 'John'};
//     await users.insertOne(mockUser);

//     const insertedUser = await users.findOne({_id: 'some-user-id'});
//     expect(insertedUser).toEqual(mockUser);
//   });
// });
