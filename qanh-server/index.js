const express = require('express');
const router = require('./router');
const worker = require('./job/worker');
// const db = require('./db');

const app = express();

function init() {
  app.listen(5001, () => {
    console.log('Listening at 5001');
    worker();
  });
}

app.use(express.json());

app.use('/', router);

init();
