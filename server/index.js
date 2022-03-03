const express = require('express');
const app = express();
//const port = 3001;
const path = require('path');
// const multer  = require('multer');
// const axios = require('axios');
// const fs = require('fs');
// const readline = require('readline');
// const stream = require('stream');

const { retrieveProductById, retrieveStylesById, retrieve5Products, retrieve5Styles } = require('.././database/index.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/../public/dist'));
const filePath = (path.join(__dirname, '/data'));

app.get('/products/:product_id', (req, res, next) => {

  const { product_id } = req.params;

  retrieveProductById(product_id, (error, results) => {
    if (error) {
      console.log('error retriving product at server: ', error);
      res.status(500);
      res.end();
    } else {
      if (results === []) {
        res.status(404);
        res.end();
      } else {
        res.status(200).send(results);
        res.end();
      }
    }
  })
})

app.get('/products/', (req, res, next) => {

  //const { product_id } = req.params;

  retrieve5Products((error, results) => {
    if (error) {
      console.log('error retriving products at server: ', error);
      res.status(500);
      res.end();
    } else {
      if (results === []) {
        res.status(404);
        res.end();
      } else {
        res.status(200).send(results);
        res.end();
      }
    }
  })
})

app.get('/styles/:product_id', (req, res, next) => {

  const { product_id } = req.params;

  retrieveStylesById(product_id, (error, results) => {
    if (error) {
      //console.log('error retriving styles at server: ', error.status);
      res.status(500);
      res.end();
    } else {
      if (results === []) {
        res.status(404);
        res.end();
      } else {
        res.status(200).send(results);
        res.end();
      }
    }
  })
})

app.get('/styles/', (req, res, next) => {

  //const { product_id } = req.params;

  retrieve5Styles((error, results) => {
    if (error) {
      console.log('error retriving styles at server: ', error);
      res.status(500);
      res.end();
    } else {
      if (results === []) {
        res.status(404);
        res.end();
      } else {
        res.status(200).send(results);
        res.end();
      }
    }
  })
})

module.exports = app;
