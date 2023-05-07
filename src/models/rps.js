import mongoose from "mongoose";

const rpsSchema = new mongoose.Schema({
    username: { type: String, required: true },
    point: { type: Number, required: true, default: 0 },
    stack: { type: Number, required: true, default: 0 },
});

const rpsModel = mongoose.model("Rps", rpsSchema);
export default rpsModel;