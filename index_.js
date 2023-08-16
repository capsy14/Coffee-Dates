const express = require("express");
const Gun = require("gun");
const app = express();
const port = 3030;
app.use(Gun.serve);

const server = app.listen(port,()=>{
    console.log(`example app listening at https://localhost:${port}`);
})
Gun({web:server});