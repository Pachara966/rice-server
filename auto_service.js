const mongoose = require('mongoose');
const config = require('config');
const express = require('express');
const app = express();

// DB Config
const db = config.get('mongoURI');

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Auto service Mongo DB connected...'))
  .catch((err) => console.log(err));

const port = process.env.port || 5444;
app.listen(port, () =>
  console.log(`Auto service Server started on port : ${port}`)
);
