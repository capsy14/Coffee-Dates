const express = require("express");
const Gun = require("gun");
const app = express();
const cors = require('cors');
const port = 8000;
const mongoose = require('mongoose')

//database connection
const MONGO_CONNECTION_URL = 'mongodb+srv://Rahul:vyE7UaJPPADluwBK@cluster0.al2l3ze.mongodb.net/Coffee-shop'

function connectDB() {
    // Database connection 
    mongoose.connect(MONGO_CONNECTION_URL, { 
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
