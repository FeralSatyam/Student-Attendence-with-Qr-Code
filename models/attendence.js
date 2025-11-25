const mongoose = require('mongoose')

const attendenceSchema = mongoose.Schema({
    sessionId: {type: mongoose.Schema.Types.ObjectId, ref: "session", requires: true},
    studentId: {type: mongoose.Schema.Types.ObjectId, ref: "student", required: true},
    markedAt: {type: Date, default: Date.now}
})

attendenceSchema.index({sessionId: 1, studentId: 1}, {unique: true})

module.exports = mongoose.model("attendence", attendenceSchema)