const mongoose = require("mongoose");

// перед созданием модели (насколько понял базы данных) создаётся схема в которой я заранее должен указать какбие будут поля, а также их параметры например тип, длинна, requered
const QuoteSchema = new mongoose.Schema({
    content: String,
    autor: String
})

// создаю и экспортирую модель на основе схемы
module.exports = mongoose.model("Quote", QuoteSchema); 