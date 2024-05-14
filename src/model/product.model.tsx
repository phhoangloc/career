const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    category: {
        type: String,
        enum: ['デイリー食品', '常温食品', '冷凍食品', '菓子類'],
        require: true
    },
    producer: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    content: {
        type: String,
    },
    cover: {
        type: String,
    },
    avata: {
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

export const productModel = mongoose.models.product || mongoose.model('product', productSchema)