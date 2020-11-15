const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};
async function connect_db() {
  await mongoose
    .connect(db, options)
    .then(() => console.log('Mongo DB connected...'))
    .catch((err) => console.log(err));
}
module.exports.connect_db = connect_db;
