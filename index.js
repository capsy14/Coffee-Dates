const express = require("express");
const Gun = require("gun");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config()

const port = process.env.PORT;

//database connection
// const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;

function connectDB() {
    // Database connection 
    mongoose.connect(process.env.MONGO_CONNECTION_URL, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
    });
    const connection = mongoose.connection
    connection.once('open', () => {
        console.log('Database connected')
    })
}

connectDB()

//to access form data
app.use(express.urlencoded({ extended:true }))
app.use(express.json())

// Enable CORS for all routes
app.use(cors())

//routes
// Import and use routes
const initRoutes = require('./routes/web');
initRoutes(app);

app.use(Gun.serve);

const server = app.listen(port,()=>{
    console.log(`example app listening at https://localhost:${port}`);
})


Gun({web:server});
