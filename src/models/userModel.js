const mongoose = require('mongoose');
const {Schema,model} = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    number : {
        type: String,
        required: true,
        unique: true
    },
    name : {
        type: String,
    },
    password : {
        type: String,
        set : (v)=> bcrypt.hashSync(v,bcrypt.genSaltSync(10)),
        required: true
    },
    img : {
        type: String,
    }
},{timestamps:true,versionKey:false});

const userModel = model("users",userSchema);

module.exports = userModel;