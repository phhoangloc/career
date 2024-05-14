const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = new Schema({
    archive: {
        type: String,
        default: "pic"
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    name: {
        type: String,
        require: true
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
})

export const ImageModel = mongoose.models.image || mongoose.model('image', imageSchema)