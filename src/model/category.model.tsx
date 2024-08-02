const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
    archive: {
        type: String,
        default: "category"
    },
    name: {
        type: String,
        require: true
    },
})

export const CategoryModel = mongoose.models.category || mongoose.model('category', categorySchema)