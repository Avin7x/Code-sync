import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    },
    language: {
        type: String,
        default: "JavaScript"
    },
    code: {
        type: String,
        default: ""
    },
   
}, {timestamps: true});

const Room = mongoose.model("Room", roomSchema);
export default Room;