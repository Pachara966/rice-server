const mongoose = require('mongoose');
const config = require('config');

// DB Config
const db = config.get('mongoURI');

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Mongo DB connected...'))
  .catch((err) => console.log(err));

const port = process.env.port || 4445;
app.listen(port, () => console.log(`Server started on port : ${port}`));
