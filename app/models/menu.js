const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name: { type: String , required:true },
    price: { type: String , required:true },
    rating: { type:String , required:true },
    imgSrc: { type:String , required:true }
})

module.exports = mongoose.model('Menu' , menuSchema)