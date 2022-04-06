const { Router } = require("express");
const router = Router();

const { checkSignupInputs, generatePasswordHash, fixName, createUser, checkLogin } = require("./functions");

const { sign } = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
    const errorMsgs = {
        unfilledInput: "All fields must be filled!",
        differentPasswords: "Password confirmation is different!",
        usedUsername: "Username already used!"
    };

    try {
        const { name, username, password } = await checkSignupInputs(await req.body, errorMsgs);

        const fixedName = await fixName(name);
        const passwordHash = await generatePasswordHash(password);

        const payload = await createUser(fixedName, username, passwordHash);
        const token = sign(payload, process.env.SECRET_JWT, { expiresIn: "1day" });
        res.status(200).json({ payload, token });
    } catch (error) {
        let status;
        switch (error.message) {
            case errorMsgs.unfilledInput:
            case errorMsgs.differentPasswords:
                status = 400;
                break;
            case errorMsgs.usedUsername:
                status = 409;
                break;
            default:
                status = 500;
        };
        res.status(status).json({ message: "Error on signup!", error: error.message });
    };
});

router.post("/login", async (req, res) => {
    const errorMsgs = {
        unfilledInput: "All fields must be filled!",
        invalidLogin: "Username or password is invalid!"
    };

    try {
        const payload = await checkLogin(await req.body, errorMsgs);
        const token = sign(payload, process.env.SECRET_JWT, { expiresIn: "1day" });

        res.status(200).json({ payload, token });
    } catch (error) {
        let status;
        switch (error.message) {
            case errorMsgs.unfilledInput:
                status = 400;
                break;
            case errorMsgs.invalidLogin:
                status = 401;
                break;
            default:
                status = 500;
        };
        res.status(status).json({ message: "Error on login!", error: error.message });
    };
});

module.exports = router;