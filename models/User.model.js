const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        username: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
    },
    { timestamps: true }
);

module.exports = model("User", userSchema);