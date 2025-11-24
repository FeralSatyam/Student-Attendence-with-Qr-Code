const mongoose = require('mongoose')

const teacherSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String
})
module.exports = mongoose.model("teacher", teacherSchema)