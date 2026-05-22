// require('dotenv').config({path : './env'})

import dotenv from "dotenv"
import express from "express";
import {connectDB} from "./db/index.js"

dotenv.config({
    path : './env' // change script in package.json
})

const app = express();

connectDB()










// ;(async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

//         app.on("error", (error) => {
//             console.log("error : " , error)
//             throw(error)
//         })
        
//         app.listen(process.env.PORT, () => {
//             console.log(`app is listening on port ${process.env.PORT}`)
//         })
//     }catch{
//         console.log("error : " , error)
//         throw(error)
//     }
// })()