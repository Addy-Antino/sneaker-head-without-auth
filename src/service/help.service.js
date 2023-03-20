const Help = require('../model/help.model')
const ErrorHandler = require('../utils/errorHandler')

//*This method is for help section

const help = async (name, email, subject, message) => {

  const help = await Help.create({
    name, email, subject, message
  })

  return help
}

module.exports = help