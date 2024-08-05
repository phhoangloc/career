const mongoose = require('mongoose')
const Schema = mongoose.Schema

const interviewSchema = new Schema({
    host: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    archive: {
        type: String,
        default: "interview"
    },
    name: {
        type: String,
    },
    slug: {
        type: String,
    },
    workplace: {
        type: Schema.Types.ObjectId,
        ref: "facility"
    },
    worktype: {
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

export const interviewModel = mongoose.models.interview || mongoose.model('interview', interviewSchema)