const { verify } = require("jsonwebtoken");

const authorization = (req, res, next) => {
    try {
        const bearer = req.get("Authorization");
        if (!bearer) throw new Error("Token not found!");

        const token = bearer.split(" ")[1];
        const decodedToken = verify(token, process.env.SECRET_JWT);

        req.user = { ...decodedToken };
        next();
    } catch (error) {res.status(401).json({ message: "Unauthorized!", error: error.message })};
};

module.exports = authorization;