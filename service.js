const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const http = require("http");
const request = require("request");
const ai = require("./controllers/ai-controller");
const mid = require("./controllers/init-controller");

var dateFormat = require("dateformat");

const user = require("./routes/user-router");
const farm = require("./routes/farm-router");
const sys = require("./routes/sys-router");
const { json } = require("express");

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/api/test", async (req, res, next) => {
  const a = await ai.predict_tl(1, 1, 3, "2021-01-01T00:00:00.000Z");
  console.log("body");
  console.log(a);
  res.send(a);
});

app.get("/api/test/update-tl", async (req, res, next) => {
  const old_tl = require("./temp/old_timeline.json");
  var province_id = 1;
  var rice_id = 29;
  var start_date = "2020-11-15T00:00:00.000000Z";
  var current_date = "2020-11-15T00:00:00.000000Z"; //current_date = dateFormat(now, "isoUtcDateTime"); "2020-11-15T00:00:00.000000Z"
  var next_day = 14;
  var old_timeline = JSON.stringify(old_tl);
  console.log("test update tl");
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
  console.log("body");
  console.log(a);
  res.send(a);
});

app.post("/api/test/midnight", mid.midnight_demo);

app.use(farm);
app.use(user);
app.use(sys);

const port = process.env.port || 3000;
app.listen(port, function () {
  console.log("Listenning on port: ", port);
});
