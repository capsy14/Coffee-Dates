const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userName: { type:String, required:true },
    age: { type:Number, required:true },
    gender: {type:String, required:true },
    status: {type:String, default: 'single'},
    email: { type:String, required:true },
    cadd: { type:String, required:true },
    photo: { type:String, default:'https://i.pinimg.com/550x/18/b9/ff/18b9ffb2a8a791d50213a9d595c4dd52.jpg'}
})

module.exports = mongoose.model('User' , userSchema)
