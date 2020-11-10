const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

function connect_db() {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log('Mongo DB connected...'))
    .catch((err) => console.log(err));
}
module.exports.connect_db = connect_db;
