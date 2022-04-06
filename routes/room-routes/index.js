const { Router } = require("express");
const router = Router();

const { createRoom, updateRoom } = require("./functions");

router.post("/", async (req, res) => {
    try {
        const newRoom = await createRoom(await req.body, await req.user);
        res.status(201).json(newRoom);
    } catch (error) {res.status(500).json({ message: "Error while creating new room!", error: error.message })};
});

router.put("/:roomId", async (req, res) => {
    try {
        const updaedRoom = await updateRoom(req.params.roomId, await req.body, await req.user);
        res.status(200).json(updaedRoom);
    } catch (error) {res.status(500).json ({ message: "Error while updating room!", error: error.message })};
});

module.exports = router;