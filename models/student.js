const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/studentdata")

const studentSchema = mongoose.Schema({
    name: String,
    course: String,
    intake: String,
    email: String,
    password: String
})

module.exports = mongoose.model("student", studentSchema)