import mongoose, { Schema } from "mongoose"

const bookSchema = new Schema({
    bookname: {
        type: String,
        required: true,

    },
    author: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },

}, {
    timestamps: true,
})

export const Book = mongoose.model("Book", bookSchema)