const mongoose = require('mongoose')

const sessionSchema = mongoose.Schema({
    classCode: {type: String, required: true},
    teacherId: {type: mongoose.Schema.Types.ObjectId, ref: "teacher", required: true},
    startedAt: {type: Date, default: Date.now},
    expiresAt: {type: Date, required: true},
    qrDataUrl: {type: String}

})

module.exports = mongoose.model("session", sessionSchema)