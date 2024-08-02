const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newsSchema = new Schema({
    genre: {
        type: String,
        default: "news"
    },
    title: {
        type: String,
    },
    slug: {
        type: String,
    },
    content: {
        type: String,
    },
    category: [{
        type: Schema.Types.ObjectId,
        ref: "category"
    }],
    createDate: {
        type: Date,
        default: Date.now,
    },
    editDate: {
        type: Date,
        default: Date.now,
    },
})

export const NewModel = mongoose.models.new || mongoose.model('new', newsSchema)