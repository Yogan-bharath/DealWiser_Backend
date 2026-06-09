import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username Required"],
        unique:[true,"Username murst be unique"]
    },
    email:{
        type:String,
        required:[true,"Email Required"],
        unique:[true,"Email must be unique"]
    },
    password:{
        type:String,
        required:[true,"Password Required"]
    },
    role:{
    type: String,
    enum: ["user", "admin"],
    default: "user"
    }
})

const userModel = mongoose.model("users",userSchema)

export default userModel