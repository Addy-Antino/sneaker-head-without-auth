const app = require("./src/app");


const dotenv=require("dotenv")

//connect with the database
const connectDB= require("./config/database")





//config path
dotenv.config({path:"./config/config.env"})

connectDB()
const server = app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})


//UnHandled Promise Rejection 

process.on("unhandledRejection",(err)=>{
    console.log(`"Error: ${err.message}`)
    console.log("Shutting down the server due to unhandled Promise Rejection")
server.close(()=>{
    process.exit(1);
})
})


//Handlig Uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to uncaught exception!")
    process.exit(1)
})