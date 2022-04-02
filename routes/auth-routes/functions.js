const User = require("../../models/User.models");

const { genSalt, hash } = require("bcryptjs");

module.exports = {
    checkSignupInputs: async (bodyRequest, unfilledInputMsg, differentPasswordsMsg, usedUsernameMsg) => {
        const { name, username, password, passwordRepeat } = await bodyRequest;

        if (!name || !username || !password || !passwordRepeat) throw new Error(unfilledInputMsg);
        if (password !== passwordRepeat) throw new Error(differentPasswordsMsg);

        const user = await User.findOne({ username });
        if (user) throw new Error(usedUsernameMsg);
    },
    generatePasswordHash: async password => {
        const salt = await genSalt(12);
        return await hash(password, salt);
    },
    fixName: name => {
        const namesArray = name.split(" ").filter(item => item !== "");
        const capitalizeFirst = namesArray.map(word => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase());
        return capitalizeFirst.join(" ");
    },
    createUser: async (nameInput, usernameInput, passwordHash) => {
        const { _id, name, username, rooms, reviews } = await User.create({
            name: nameInput,
            username: usernameInput,
            password: passwordHash
        });
        return { _id, name, username, rooms, reviews };
    }
};