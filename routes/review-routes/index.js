const { Router } = require("express");
const router = Router();

const { makeReview, updateReview } = require("./functions");
const errorMsgs = {
    missingComent: "Missing comment!",
    notAllowed: "User can't make a review in own room!"
}

router.post("/:roomId", async (req, res) => {
    try {
        const { comment } = await req.body;
        const { roomId } = req.params;
        const { _id: userId } = await req.user;
        const newReview = await makeReview(comment, roomId, userId, errorMsgs);
        res.status(201).json(newReview);
    } catch (error) {
        let status;
        switch (error.message) {
            case errorMsgs.missingComent:
                status = 400;
                break;
            case errorMsgs.notAllowed:
                status = 405;
                break;
            default:
                status = 500;
        };
        res.status(status).json({ message: "Error while making new review!", error: error.message })
    };
});

router.put("/:reviewId", async (req, res) => {
    const missingComent = "Missing comment!";

    try {
        const { reviewId } = req.params;
        const { _id: userId } = await req.user;
        const { comment } = await req.body;
        const updatedReview = await updateReview(reviewId, userId, comment, missingComent);
        res.status(200).json(updatedReview);
    } catch (error) {
        const status = (error.message === missingComent) ? 400 : 500;
        res.status(status).json({ message: "Error while updating review!", error: error.message });
    };
});

module.exports = router;