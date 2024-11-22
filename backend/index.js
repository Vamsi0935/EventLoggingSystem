const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const app = express();
const eventLogRoute = require("./routes/event.route");
const cors = require("cors");

app.use(bodyParser.json());
app.use(express.json());
app.use(cors("http://localhost:3001"))

mongoose.connect("mongodb+srv://dvkrishna142000:FOJE6srGniwtzf56@cluster0.vy30i.mongodb.net/EventLoggingSystem?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("MongoDB is connected successfully.....");
    }).catch((err) => {
        console.log(err)
    });

app.use("/api/events", eventLogRoute)

app.listen(8000, () => {
    console.log("Server is running at 8000....")
})