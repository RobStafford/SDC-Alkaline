
const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const multer  = require('multer');
//const upload = multer({ dest: 'uploads/' });
//const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');


const { retrieveById } = require('.././database/index.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/../public/dist'));
const filePath = (path.join(__dirname, '/data'));

app.listen(port, () => {
  console.log(`SDC server listening on http://localhost:${port}`)
})
