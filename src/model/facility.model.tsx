const mongoose = require('mongoose')
const Schema = mongoose.Schema

const facilitySchema = new Schema({
    host: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    archive: {
        type: String,
        default: "facility"
    },
    name: {
        type: String,
    },
    worktype: {
        type: String,
    },
    slug: {
        type: String,
    },
    postno: {
        type: String,
    },
    address: {
        type: String,
    },
    location: {
        type: String,
    },
    area: {
        type: String,
    },
    phone: {
        type: String,
    },
    fax: {
        type: String,
    },
    email: {
        type: String,
    },
    homepage: {
        type: String,
    },
    map: {
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
    work: [{
        type: Schema.Types.ObjectId,
        ref: "post"
    }]
})

export const facilityModel = mongoose.models.facility || mongoose.model('facility', facilitySchema)