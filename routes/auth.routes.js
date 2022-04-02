const { Router } = require("express");
const router = Router();

const User = require("../models/User.models");

const { genSalt, hash } = require("bcryptjs");

const { sign } = require("jsonwebtoken");

const checkInputs = async (
    name,
    username,
    password,
    passwordRepeat,
    unfilledInputMsg,
    differentPasswordsMsg,
    usedUsernameMsg
) => {
    if (!name || !username || !password || !passwordRepeat) throw new Error(unfilledInputMsg);
    if (password !== passwordRepeat) throw new Error(differentPasswordsMsg);

    const user = await User.findOne({ username });
    if (user) throw new Error(usedUsernameMsg);
};

const generatePasswordHash = async password => {
    const salt = await genSalt(12);
    return await hash(password, salt);
};

const fixName = name => {
    const namesArray = name.split(" ").filter(item => item !== "");
    const capitalizeFirst = namesArray.map(word => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase());
    return capitalizeFirst.join(" ");
};

const createUser = async (nameInput, usernameInput, passwordHash) => {
    const { _id, name, username, rooms, reviews } = await User.create({
        name: nameInput,
        username: usernameInput,
        password: passwordHash
    });
    return { _id, name, username, rooms, reviews };
};

router.post("/signup", async (req, res) => {
    const unfilledInput = "All fields must be filled!";
    const differentPasswords = "Password repeat is different!";
    const usedUsername = "Username already used!";

    try {
        const { name, username, password, passwordRepeat } = await req.body;

        await checkInputs(
            name,
            username,
            password,
            passwordRepeat,
            unfilledInput,
            differentPasswords,
            usedUsername
        );

        const fixedName = await fixName(name);

        const passwordHash = await generatePasswordHash(password);

        const payload = await createUser(fixedName, username, passwordHash);

        const token = sign(payload, process.env.SECRET_JWT, { expiresIn: "1day" });

        res.status(200).json({ payload, token });
    } catch (error) {
        res.status(500).json({ error: error.message })
    };
});

module.exports = router;