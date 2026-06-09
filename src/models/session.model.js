import mongoose from "mongoose";

const sessionSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true,"user is Required"]
    },
    refreshtoken:{
        type: String,
        required: [true,"refresh Token is Required"]
    },
    ip:{
        type:String,
        required: [true,"IP is Required"]
    },
    userAgent:{
        type:String,
        required:[true,"UserAgent is Requires[Chrome,edge,etc]"]
    },
    revoke:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const sessionModel = mongoose.model("sessions",sessionSchema)

export default sessionModel


