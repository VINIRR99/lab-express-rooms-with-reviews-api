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
    },
    updateReview: async (reviewId, userId, comment, missingCommentMsg) => {
        if (!comment) throw new Error(missingCommentMsg);

        const updatedReview = await Review.findOneAndUpdate({ _id: reviewId, user: userId }, { comment }, { new: true })
            .select("-createdAt -updatedAt -__v");
        return updatedReview;
    },
    deleteReview: async (reviewId, userId, notAllowedMsg) => {
        const review = await Review.findOne({ _id: reviewId, user: userId }, { _id: 0, room: 1 });
        if (!review) throw new Error(notAllowedMsg);

        await Review.findOneAndDelete({ _id: reviewId, user: userId });
        await Room.findByIdAndUpdate(review.room, { $pull: { reviews: reviewId } });
        await User.findByIdAndUpdate(userId, { $pull: { reviews: reviewId } });
    }
};