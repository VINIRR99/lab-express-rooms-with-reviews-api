const { Schema, model } = require("mongoose");

const roomSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        imageURL: {
            type: String,
            default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfpPVijwnCRZeDmz9C-E9_lcYR_mho_M2FBQ&usqp=CAU"
        },
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
        user: { type: Schema.Types.ObjectId, required: true }
    },
    { timestamps: true }
);

module.exports = model("Room", roomSchema);