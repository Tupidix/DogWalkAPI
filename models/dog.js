import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ObjectId = mongoose.Types.ObjectId;

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
	master: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        validate: {
            validator: async function (value) {
                if (!Array.isArray(value) || value.length === 0) {
                    return false; // Le tableau d'IDs est vide
                }

                // Vérifier chaque ID dans le tableau
                for (const id of value) {
                    const user = await mongoose.model('User').findOne({ _id: id }).exec();
                    if (!user) {
                        return false; // Au moins un ID n'existe pas
                    }
                }
                return true; // Tous les IDs existent
            },
            message: "At least one valid master is required",
        },
        required: [true, "At least one master is required"],
    },
	dislike: [{ type: Schema.Types.ObjectId, ref: "Dog" }],
	picture: { type: String, required: true },
});

// function validateUser(value) {
// 	if (!ObjectId.isValid(value)) {
// 		throw new Error('Invalid user ID');
// 	}
  
// 	return mongoose
// 	  .model('User')
// 	  .findOne({ _id: new ObjectId(value) })
// 	  .exec()
// 	  .then(user => {

// 		if (!user) {
// 		  throw new Error('User not found');
// 		}
  
// 		return true;
// 	  });
//   }

export default mongoose.model("Dog", dogSchema);