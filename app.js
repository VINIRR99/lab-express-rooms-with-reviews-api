require("dotenv").config();

const connectDb = require("./configs/db.configs");
connectDb();

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

const corsOptions = {
    credentials: true,
    origin: [process.env.ACCESS_CONTROL_ALLOW_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"]
};

app.use(cors(corsOptions));

app.use("/auth", require("./routes/auth-routes"))

//app.use(require("./middlewares/auth.middlewares"));

//app.use("/room", require("./routes/room.routes"));
//app.use("/review", require("./routes/review.routes"));
//app.use("/user", require("./routes/user.routes"));

app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}
corsOptions:`, corsOptions));