const Review = require("../../models/Review.model");
const Room = require("../../models/Room.model");
const User = require("../../models/User.model");

module.exports = {
    makeReview: async (commentInput, roomId, userId, errorMsgs) => {
        if (!commentInput) throw new Error(errorMsgs.missingComent);
        const roomCheck = await Room.findById(roomId, { user: 1, _id: 0 });
        if (roomCheck.user == userId) throw new Error(errorMsgs.notAllowed);

        const { _id: reviewId, comment, room, user } = await Review.create({
            comment: commentInput,
            room: roomId,
            user: userId
        });
        await Room.findByIdAndUpdate(roomId, { $push: { reviews: reviewId } });
        await User.findByIdAndUpdate(userId, { $push: { reviews: reviewId } });
        return { _id: reviewId, comment, room, user };
    }
};