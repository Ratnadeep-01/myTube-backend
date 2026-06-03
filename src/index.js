// require('dotenv').config({path : './.env'})
import 'dotenv/config';
// import dotenv from "dotenv";
// dotenv.config({
//     path : './.env' // change script in package.json
// })
import {connectDB} from "./db/index.js";
import { app } from "./app.js";



connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("error" , error)
        throw(error)
    })
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`app is connected at port ${port}`)
    })
})
.catch((err) => {
    console.log("MongoDB connection failure", err)
})
  









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