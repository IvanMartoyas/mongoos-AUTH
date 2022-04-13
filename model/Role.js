const {Schema, model} = require("mongoose");

const Role = new Schema({
    value: {
        type: String,
        unique: true,
        default: "USER"// подефолту все новые пользователи это юзеры
    }
})


module.exports = model("Role", Role); 