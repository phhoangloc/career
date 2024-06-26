const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    host: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    archive: {
        type: String,
        default: "post"
    },
    title: {
        type: String,
    },
    slug: {
        type: String,
    },
    workplace: {
        type: String,
    },
    worktype: {
        type: String,
    },
    workstatus: {
        type: String,
        default: "正社員"
    },
    location: {
        type: String,
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: "image"
    },
    contenttitle: {
        typ: String,
    },
    content: {
        type: String,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "comment"
        }
    ],
    createDate: {
        type: Date,
        default: Date.now,
    },
})

export const postModel = mongoose.models.post || mongoose.model('post', postSchema)