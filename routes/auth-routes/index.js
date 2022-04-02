const { Router } = require("express");
const router = Router();

const { checkSignupInputs, generatePasswordHash, fixName, createUser } = require("./functions");

const { sign } = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
    const unfilledInput = "All fields must be filled!";
    const differentPasswords = "Password repeat is different!";
    const usedUsername = "Username already used!";

    try {
        await checkSignupInputs(req.body, unfilledInput, differentPasswords, usedUsername);
        const { name, username, password } = await req.body;

        const fixedName = await fixName(name);
        const passwordHash = await generatePasswordHash(password);

        const payload = await createUser(fixedName, username, passwordHash);
        const token = sign(payload, process.env.SECRET_JWT, { expiresIn: "1day" });
        res.status(200).json({ payload, token });
    } catch (error) {
        switch (error.message) {
            case unfilledInput:
            case differentPasswords:
                res.status(400).json({ error: error.message });
                break;
            case usedUsername:
                res.status(409).json({ error: error.message });
                break;
            default:
                res.status(500).json({ error: error.message });
        };
    };
});

module.exports = router;