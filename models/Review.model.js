const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
    {
        comment: { type: String, maxlength: 200 },
        room: { type: Schema.Types.ObjectId, ref: "Room" },
        user: { type: Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

module.exports = model("Review", reviewSchema);