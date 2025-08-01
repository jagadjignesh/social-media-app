const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const mongodb = async () => {
    try {
        await mongoose.connect(process.env.DATAMONGODB_URL);
        console.log("connection suceessfully");
    } catch(error) {
        throw new Error(`Someting wrong ${error}`);
    }
}

module.exports = mongodb;