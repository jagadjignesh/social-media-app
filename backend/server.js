const express = require("express");
const dotenv = require('dotenv').config();
const userRoutes = require('./routes/userRoute');
const mongodb = require("./config/config");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({
  origin: 'https://social-media-app-frontend-7qbh.onrender.com',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth/',userRoutes);

const port = process.env.PORT || 5000;

mongodb().then(() => {
    app.listen(port, () => {
        console.log(`${port}`);
    });
});
