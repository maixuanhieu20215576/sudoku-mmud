var express = require('express')
var cors = require('cors')
const mongoose = require('mongoose');
var app = express()

app.use(cors())


app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})
 
const start = async () => {
  try {
    await mongoose.connect(
      'mongodb://root:example@database:27017/sudoku?authSource=admin',//sửa sau nhé :v
    );
    app.listen(4000, () => console.log("Server started on port 4000"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();