const mongoose = require('mongoose')
const Schema = mongoose.Schema

const worktypeSchema = new Schema({
    archive: {
        type: String,
        default: "worktype"
    },
    name: {
        type: String,
        require: true
    },
})

export const worktypeModel = mongoose.models.worktype || mongoose.model('worktype', worktypeSchema)