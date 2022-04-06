const User = require("../../models/User.model");

const { genSalt, hash, compare } = require("bcryptjs");

module.exports = {
    checkSignupInputs: async (bodyRequest, errorMsgs) => {
        const { name, username, password, passwordConfirmation } = await bodyRequest;

        if (!name || !username || !password || !passwordConfirmation) throw new Error(errorMsgs.unfilledInput);
        if (password !== passwordConfirmation) throw new Error(errorMsgs.differentPasswords);

        const user = await User.findOne({ username }, { _id: 0, username: 1 });
        if (user) throw new Error(errorMsgs.usedUsername);

        return { name, username, password };
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
    },
    checkLogin: async (bodyRequest, errorMsgs) => {
        const { username: usernameInput, password: passwordInput } = await bodyRequest;
        if (!usernameInput || !passwordInput) throw new Error(errorMsgs.unfilledInput);

        const user = await User.findOne(
            { username: usernameInput },
            {
                name: 1,
                username: 1,
                password: 1,
                rooms: 1,
                reviews: 1
            }
        );
        if (!user) throw new Error(errorMsgs.invalidLogin);

        const { _id, name, username, password: passwordHash, rooms, reviews } = await user;

        const compareHash = await compare(passwordInput, passwordHash);
        if (!compareHash) throw new Error(errorMsgs.invalidLogin);

        return { _id, name, username, rooms, reviews };
    }
};