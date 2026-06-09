import mongoose  from "mongoose";
import config from "./config.js";

async function ConnectDB() {
    try{
        await mongoose.connect(config.MONGO_URL)
        console.log("Connected to Database ✅");
    }
    catch(error){
        console.error(error+"Error In Conneting Database");
    }
}

export default ConnectDB