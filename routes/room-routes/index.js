const { Router } = require("express");
const router = Router();

const { createRoom } = require("./functions");

router.post("/", async (req, res) => {
    try {
        const newRoom = await createRoom(await req.body, await req.user);
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(500).json({ message: "Error while creating new room!", error: error.message });
    };
});

module.exports = router;