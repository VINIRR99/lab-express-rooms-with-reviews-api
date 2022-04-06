const { Router } = require("express");
const router = Router();

const Room = require("../models/Room.model");

router.post("/", async (req, res) => {
    try {
        if (!req.body.name) {
            const userRooms = await Room.find({ user: req.user._id }, { _id: 1 });
            req.body.name = `Room number ${userRooms.length + 1} by ${req.user.username}`;
        };
        if (!req.body.description) req.body.description = "No description provided!"
        req.body.user = await req.user._id;

        const newRoom = await Room.create(req.body);
        res.status(200).json(newRoom);
    } catch (error) {
        res.status(500).json({ message: "Error while creating new room!", error: error.message });
    };
});

module.exports = router;