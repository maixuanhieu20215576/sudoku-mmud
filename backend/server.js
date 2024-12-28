const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config();
var app = express()
console.log(process.env) // remove this after you've confirmed it is working
app.use(cors())


app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})
 
const start = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );
    app.listen(4000, () => console.log("Server started on port 4000"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();