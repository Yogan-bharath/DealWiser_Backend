import dotenv from "dotenv";
dotenv.config()

if(!process.env.MONGO_C01){
    throw new Error("MONGO_URL is not Found in .env")
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not Found in .env")
}

const config = {
    MONGO_URL : process.env.MONGO_C01,
    JWT_SECRET : process.env.JWT_SECRET
}

export default config