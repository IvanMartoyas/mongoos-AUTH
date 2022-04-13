const {Schema, model} = require("mongoose");

const User = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: [{
        type: String, 
        ref: 'Role'
    }]
})

// название модели которая создатсься User
module.exports = model("User", User); 