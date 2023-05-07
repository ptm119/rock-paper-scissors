import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/rps");

const db = mongoose.connection;

db.on("error", (error) => {
    console.log(`❌ db error ${error}`);
})
db.once("open", () => {
    console.log("✅ connected to db");
})