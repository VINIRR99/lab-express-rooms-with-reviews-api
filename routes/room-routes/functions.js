const Room = require("../../models/Room.model");
const User = require("../../models/User.model");

module.exports = {
    createRoom: async (bodyRequest, { _id: userId, username }) => {
        if (!bodyRequest.name) {
            const userRooms = await Room.find({ user: userId }, { _id: 1 });
            bodyRequest.name = `Room number ${userRooms.length + 1} by ${username}`;
        };
        if (!bodyRequest.description) bodyRequest.description = "No description provided!";
        bodyRequest.user = await userId;

        const { _id: roomId, name, description, imageURL, reviews, user } = await Room.create(bodyRequest);
        await User.findByIdAndUpdate(userId, { $push: { rooms: roomId } });
        return { _id: roomId, name, description, imageURL, reviews, user };
    },
    updateRoom: async (roomId, bodyRequest, userId) => {
        const updatedRoom = await Room.findOneAndUpdate({ _id: roomId, user: userId }, bodyRequest, { new: true })
            .select("-createdAt -updatedAt -__v");
        return updatedRoom;
    },
    deleteRoom: async (roomId, userId) => {
        await Room.findOneAndDelete({ _id: roomId, user: userId });
        await User.findByIdAndUpdate(userId, { $pull: { rooms: roomId } });
    },
    getRooms: async (query) => {
        const allRooms = await Room.find(query, { createdAt: 0, updatedAt: 0, __v: 0 });
        return allRooms;
    }
};