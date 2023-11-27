import e from "express";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ObjectId = mongoose.Types.ObjectId;

const dogSchema = new Schema({
	name: {
		type: String,
		required: true,
		minlength: [2, "Dog name is too short"],
		maxlength: [20, "Dog name is too long"],
	},
	birthdate: {
		type: Date,
		required: true,
	},
	breed: {
		type: String,
		required: true,
		minlength: [3, "Dog breed is too short"],
		maxlength: [40, "Dog breed is too long"],
	},
	master: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		validate: {
			validator: async function (value) {
				if (!Array.isArray(value) || value.length === 0) {
					throw new Error("You must have at least one master");
				}

				// Vérifier chaque ID dans le tableau
				let ArrayOfNonExistingIDs = [];
				for (const id of value) {
					const user = await mongoose.model("User").findOne({ _id: id }).exec();
					if (!user) {
						// On va banquer les IDs qui n'existent pas pour tous les afficher à la fin au moment du dévoilement de l'erreur
						ArrayOfNonExistingIDs.push(id);
					}
				}

				if (ArrayOfNonExistingIDs.length === 1) {
					throw new Error(`This user doesn't exist: ${ArrayOfNonExistingIDs}`);
				}

				if (ArrayOfNonExistingIDs.length > 1) {
					throw new Error(`These users don't exist: ${ArrayOfNonExistingIDs}`);
				}

				return true; // Tous les IDs existent
			},
		},
	},
	dislike: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: "Dog",
			},
		],
		validate: {
			validator: async function (value) {
				// Vérifier chaque ID dans le tableau
				let ArrayOfNonExistingIDs = [];
				for (const id of value) {
					const user = await mongoose.model("Dog").findOne({ _id: id }).exec();
					if (!user) {
						// On va banquer les IDs qui n'existent pas pour tous les afficher à la fin au moment du dévoilement de l'erreur
						ArrayOfNonExistingIDs.push(id);
					}
				}

				if (ArrayOfNonExistingIDs.length === 1) {
					throw new Error(`This dog doesn't exist: ${ArrayOfNonExistingIDs}`);
				}

				if (ArrayOfNonExistingIDs.length > 1) {
					throw new Error(`These dogs don't exist: ${ArrayOfNonExistingIDs}`);
				}

				return true; // Tous les IDs existent
			},
		},
	},
	picture: { type: String, required: true },
});

export default mongoose.model("Dog", dogSchema);