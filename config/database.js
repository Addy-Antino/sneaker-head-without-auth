const mongoose = require('mongoose')
const connectDB = () => {
  mongoose.set('strictQuery', true);

  mongoose.connect(process.env.DB_URL, ({
    useNewUrlParser: true,
  })).then((data) => {
    console.log(`Connected with database: ${data.connection.host}`)
  });
}
module.exports = connectDB