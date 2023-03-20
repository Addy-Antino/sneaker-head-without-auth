const express = require('express')
const errorMid = require("./middleware/error")
const cors = require('cors');
const bodyParser = require("body-parser");


const app = express()
const cookieParser = require("cookie-parser")
app.use(express.json())
app.use(cookieParser())


const product = require("./routes/product.Route")
const user = require("./routes/user.Route")
const order = require("./routes/order.Route")
const help = require("./routes/help.route")
const payment = require("./routes/payment.route")
const cart = require("./routes/cart.route")
const fileUpload = require('express-fileupload')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser({ limit: '50mb' }));
app.use(fileUpload({ useTempFiles: true }))

app.use(cors());
app.use("/api/v1", product)
app.use("/api/v1", user)
app.use("/api/v1", order)
app.use("/api/v1", help)
app.use('/api/v1', payment)
app.use('/api/v1', cart)
app.use(errorMid)

module.exports = app