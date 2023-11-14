import mongoose from "mongoose";

const Schema = mongoose.Schema;

const dogSchema = new Schema({
	name: {
		type: String,
		required: true,
		minlength: [3, "Dog name is too short"],
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
	master: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
	dislike: [{ type: Schema.Types.ObjectId, ref: "Dog" }],
	picture: { type: String, required: true },
});

export default mongoose.model("Dog", dogSchema);
