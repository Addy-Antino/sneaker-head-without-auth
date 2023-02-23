const express =require('express')
const errorMid = require("./middleware/error")
const cors = require('cors');



const app=express()
const cookieParser =  require("cookie-parser")
app.use(express.json())


const product=require("./routes/product.Route")
const user=require("./routes/user.Route")

app.use(cors());
app.use("/api/v1",product)
app.use("/api/v1",user)
app.use(errorMid)

module.exports=app