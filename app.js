const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Connect to mongodb cloud server using mongoose
mongoose.connect("mongodb+srv://reco117:Benjamin!2@cluster0.6nxdu.mongodb.net/coinmancer?retryWrites=true/" , { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

const pagesController = require(__dirname + "/app/controllers/pagesController");
app.use(pagesController);

const articlesController = require(__dirname + "/app/controllers/articlesController");
app.use(articlesController);

app.listen(process.env.PORT || 3030, function(){
    console.log("Docked at port 3030");
});