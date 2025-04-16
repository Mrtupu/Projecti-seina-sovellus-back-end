const mongoose = require('mongoose');
const { Transform } = require('supertest/lib/test');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true },
    projects: { type: [String], required: true },
    role: { type: String, required: true },
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User
