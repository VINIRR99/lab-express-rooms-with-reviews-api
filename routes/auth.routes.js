const { Router } = require("express");

const User = require("../models/User.models");

const { genSalt, hash } = require("bcryptjs");

const { sign } = require("jsonwebtoken");

const router = Router()

router.post("/signup", async (req, res) => {
    const passwordRequired = "Password is required!";
    const passwordRepeatRequired = "Password repeat is required!";
    const differentPasswords = "Password repeat is different!";
    const usedUserName = "Username already used!";

    try {
        const { name: nameInput, username: usernameInput, password: passwordInput, passwordRepeat } = await req.body;

        if (passwordInput.length === 0) throw new Error(passwordRequired);
        if ((passwordInput.length > 0) && (passwordRepeat.length === 0)) throw new Error(passwordRepeatRequired);
        if (passwordInput !== passwordRepeat) throw new Error(differentPasswords);
        
        const user = await User.findOne({ username: usernameInput });
        if (user) throw new Error(usedUserName);

        const salt = await genSalt(12);
        const passwordHash = await hash(passwordInput, salt);

        const { _id, name, username, rooms, reviews } = await User.create({ name: nameInput, username: usernameInput, password: passwordHash });

        const payload = { _id, name, username, rooms, reviews };

        const token = sign(payload, "secret", { expiresIn: "1day" });

        res.status(200).json({ payload, token });
    } catch (error) {
        res.status(500).json({ error: error.message })
    };
});

module.exports = router;