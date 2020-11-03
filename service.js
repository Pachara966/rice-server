const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const app = express();
const ai = require('./controllers/ai-controller');
const mid = require('./controllers/init-controller');

const user = require('./routes/user-router');
const farm = require('./routes/farm-router');
const sys = require('./routes/sys-router');

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

app.get('/', (req, res, next) => {
  res.send('<h1>Hello World</h1>');
});

app.get('/api/test', async (req, res, next) => {
  const a = await ai.predict_tl(1, 1, 3, '2021-01-01T00:00:00.000Z');
  // console.log('body');
  // console.log(a);
  res.send(a);
});

app.get('/api/test/update-tl', async (req, res, next) => {
  const old_tl = require('./temp/old_timeline.json');
  var province_id = 1;
  var rice_id = 29;
  var start_date = '2020-11-15T00:00:00.000000Z';
  var current_date = '2020-11-15T00:00:00.000000Z'; //current_date = dateFormat(now, "isoUtcDateTime"); "2020-11-15T00:00:00.000000Z"
  var next_day = 14;
  var old_timeline = JSON.stringify(old_tl);
  console.log('test update tl');
  var test_mode = 1;
  var test_data = 0;
  const a = await ai.update_tl(
    province_id,
    rice_id,
    start_date,
    current_date,
    next_day,
    old_timeline,
    test_mode,
    test_data
  );
  console.log('body');
  console.log(a);
  res.send(a);
});

app.post('/api/test/midnight', mid.midnight_demo);

app.use(farm);
app.use(user);
app.use(sys);

const port = process.env.port || 4444;
app.listen(port, () => console.log(`Server started on port : ${port}`));
