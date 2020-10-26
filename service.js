const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http');

const user = require("./routes/user-router");
const farm = require("./routes/farm-router");
const sys = require("./routes/sys-router");

const corsOptions = {
    origin: process.env.CORS_ORIGIN
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
    res.send('<h1>Hello World</h1>');
});

app.get('/api/test', (req, res, next) => {
    console.log('request');
    const data = {
        name:'hello',
        surenamr:'world',
        address:{
            no:'58/224',
            soi:'30'
        }
    };
    res.send(data);
});

app.use(farm);
app.use(user);
app.use(sys);

const port = process.env.port || 3000;
app.listen(port, function() {
    console.log('Listenning on port: ', port);
});