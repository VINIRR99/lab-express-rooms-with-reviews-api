const { connect } = require("mongoose");

const connectDb = async () => {
    try {
        const { connections } = await connect(process.env.MONGODB_URI);
        console.log(`Connected to the database: ${connections[0].name}`);
    } catch (error) {console.error("Error connecting to the database", error)};
};

module.exports = connectDb;