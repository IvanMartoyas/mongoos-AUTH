const express = require('express')
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routs = require("./router/routs");


// const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = "mongodb://localhost:27017/auth";

app.use(bodyParser.json());
app.use(express.json())
//..............................................................


app.use('/auth', routs);

const strat = async () => {
    try {
// крашит приложение
        await mongoose.connect(uri);     
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });     
        
        app.listen(3000, console.log("server start on http://localhost:3000/ "));

    } catch (e) {
        console.log("error ",e)
    }
}

strat();