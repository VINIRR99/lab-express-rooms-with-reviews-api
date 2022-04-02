const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        userName: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
    },
    { timestamps: true }
);