const express =require('express')
const errorMid = require("./middleware/error")
const app=express()

app.use(express.json())

const product=require("./routes/product.Route")
const user=require("./routes/user.Route")


app.use("/app/v1",product)
app.use("/app/v1",user)
app.use(errorMid)

module.exports=app