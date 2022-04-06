const { Router } = require("express");
const router = Router();

const { createRoom, updateRoom, deleteRoom, getRooms } = require("./functions");

router.post("/", async (req, res) => {
    try {
        const newRoom = await createRoom(await req.body, await req.user);
        res.status(201).json(newRoom);
    } catch (error) {res.status(500).json({ message: "Error while creating new room!", error: error.message })};
});

router.put("/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params;
        const { _id: userId } = await req.user;
        const updaedRoom = await updateRoom(roomId, await req.body, userId);
        res.status(200).json(updaedRoom);
    } catch (error) {res.status(500).json ({ message: "Error while updating room!", error: error.message })};
});

router.delete("/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params;
        const { _id: userId } = await req.user;
        await deleteRoom(roomId, userId);
        res.status(204).json();
    } catch (error) {res.status(500).json({ message: "Error while deleting room!", error: error.message })};
});

router.get("/", async (req, res) => {
    try {
        const allRooms = await getRooms({});
        res.status(200).json(allRooms);
    } catch (error) {res.status(500).json({ message: "Error while getting all rooms!", error: error.message })};
});

router.get("/user-rooms", async (req, res) => {
    try {
        const { _id: userId } = await req.user;
        const userRooms = await getRooms({ user: userId });
        res.status(200).json(userRooms);
    } catch (error) {res.status(500).json({ message: "Error while getting user rooms!", error: error.message })};
});

router.get("/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params;
        const { _id: userId } = await req.user;
        const room = await getRooms({ _id: roomId, user: userId });
        res.status(200).json(room[0]);
    } catch (error) {res.status(500).json({ message: "Error while getting a specific room!", error: error.message })};
});

module.exports = router;