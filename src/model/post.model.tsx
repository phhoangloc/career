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
        type: Schema.Types.ObjectId,
        ref: "facility"
    },
    worktype: {
        type: String,
    },
    requirement: {
        type: String,
    },
    workstatus: {
        type: String,
        default: "正社員"
    },
    worktime: {
        type: String,
    },
    worksalary: {
        type: String,
    },
    workbenefit: {
        type: String,
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

    createDate: {
        type: Date,
        default: Date.now,
    },
})

export const postModel = mongoose.models.post || mongoose.model('post', postSchema)