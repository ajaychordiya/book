const express = require("express");
const mongoose = require("mongoose");
//const bodyParser = require('body-parser');
const url = "mongodb://localhost/bookReselling";
const path = require("path");

const route = require("./route/auth");
const route1 = require("./route/book");
const route2 = require("./route/contact");
var cors = require("cors");
const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "uploads")));

//connection database
mongoose.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });

const con = mongoose.connection;

con.on("open", () => console.log("connected"));

//middleware

app.use(express.json()); //converting data text to json
app.use("/uploads", express.static(__dirname + "/uploads"));

//routes
app.use("/", route);
app.use("/api", route1);
app.use("/contactus", route2);

//giving port no to app
app.listen(3000, () => console.log("server up and running"));
