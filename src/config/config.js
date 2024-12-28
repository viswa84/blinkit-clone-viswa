import { config } from 'dotenv'
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";

import { Admin } from "../models/index.js";
config();
const MongoDbStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDbStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
});
sessionStore.on("error", (error) => {
    console.log("Session store error", error)
});


export const authenticate = async (email, password) => {
    if (email && password) {

     const user  = await Admin.findOne({email})
     if(!user){
        return null
     }
     if(user.password === password){
        return Promise.resolve({email:email,password:password})
     }
     else {
        return null
     }
    }
    return null
}

export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
