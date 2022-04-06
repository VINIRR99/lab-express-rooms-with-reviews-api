const { Schema, model } = require("mongoose");

const roomSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true, default: "No description provided." },
        imageURL: { type: String },
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
    },
    { timestamps: true }
);

module.exports = model("Room", roomSchema);