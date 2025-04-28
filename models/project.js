const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    projectType: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    members: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    deadline: { type: Date, required: true },
})

projectSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
   } 
})

module.exports = mongoose.model('Project', projectSchema)