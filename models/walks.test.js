import Walk from "./walk.js";

/*
	title: {
		type: String,
		required: true,
		minlength: [3, "Walk name is too short"],
		maxlength: [40, "Walk name is too long"],
	},
	path: [
		{
			type: {
				type: String,
				required: true,
				enum: ["Point"],
			},
			coordinate: {
				type: [Number],
				required: true,
				validate: {
					validator: validateGeoJsonCoordinates,
					message: "Path coordinates must be an array of two numbers",
				},
			},
		},
	],
	creator: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		validate: {
			validator: async function (value) {
				if (!Array.isArray(value) || value.length === 0 || value.length > 1) {
					throw new Error("You must have one creator");
				}

				const user = await mongoose.model("User").findOne({ _id: value }).exec();
				if (!user) {
					throw new Error(`This user doesn't exist: ${value}`);
				}

				return true; // Le l'ID du user existe
			},
		},
	},
});
 */

describe("Walk Model", () => {
	it("should throw an error if title is missing", async () => {
		await expect(async () => {
			const walk = new Walk({
				path: [
					{
						type: "Point",
						coordinate: [1, 1],
					},
				],
				creator: ["5f8f5f7f7f7f7f7f7f7f7f7f"],
			});

			await Walk.validate();
		}).rejects.toThrow("Validation failed: title: Path `title` is required.");
	});
});
