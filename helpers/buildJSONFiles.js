const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const multer  = require('multer');
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const $ = require('jquery');
const csv = require('jquery-csv');

//this code originally lived in server, but most isn't needed there (& some isn't needed here).

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const filePath = (path.join(__dirname, '/data'));

let mainList = [];
let featureList = [];
let styleList = [];
let photoList = [];
let skuList = [];

async function importStyles() {
  const newFilePath = (path.join(filePath, '../.././data/styles.csv'));
  const instream = fs.createReadStream(newFilePath);
  const outstream = new stream();
  const rl = readline.createInterface(instream, outstream);
  const keyList = ['id', 'productId', 'name', 'sale_price', 'original_price', 'default_style'];

  return new Promise((resolve, reject) => {
    let lineCount = 0;

    rl.on('line', function(line) {

      lineCount++;
      if (lineCount > 1) {
        let currentRecord = new Object;
        let currentLine = csv.toArray(line);
        for (let i = 0; i < 8; i++) {
          if (i === 2 || i === 5) {
            currentRecord[keyList[i]] = currentLine[i];
          } else if (i < 2 || i === 3 || i === 4) {
            if (currentLine[i] === 'null') {
              currentRecord[keyList[i]] = currentLine[i];
            } else {
              currentRecord[keyList[i]] = parseInt(currentLine[i]);
            }
          } else if (i === 6) {
            currentRecord['photos'] = new Array;
          } else if (i === 7) {
            currentRecord['skus'] = new Object;
          }

        }
        styleList.push(currentRecord);
      }
    });

    rl.on('close', function() {
      console.log('1');
      resolve(styleList);
    })
  })
}

async function importPhotos(styleList) {
  const newFilePath = (path.join(filePath, '../.././data/photos.csv'));

  const instream = fs.createReadStream(newFilePath);
  const outstream = new stream();
  const rl = readline.createInterface(instream, outstream);
  const keyList = ['id', 'styleId', 'url', 'thumbnail_url'];

  return new Promise((resolve, reject) => {
    let lineCount = 0;

    rl.on('line', function(line) {

      lineCount++;
      if (lineCount > 1) {
        let currentRecord = new Object;
        let currentLine = csv.toArray(line);
        for (let i = 0; i < 4; i++) {
          if (i < 2) {
            currentRecord[keyList[i]] = parseInt(currentLine[i]);
          } else {
            currentRecord[keyList[i]] = currentLine[i];
          }
        }
        photoList.push(currentRecord);
      }
    });

    rl.on('close', function() {
      console.log('2');
      resolve(photoList);
    })
  })

}

async function importSkus() {
  const newFilePath = (path.join(filePath, '../.././data/skus.csv'));

  const instream = fs.createReadStream(newFilePath);
  const outstream = new stream();
  const rl = readline.createInterface(instream, outstream);
  const keyList = ['id', 'styleId', 'size', 'quantity'];

  return new Promise((resolve, reject) => {
    let lineCount = 0;

    rl.on('line', function(line) {

      lineCount++;
      if (lineCount > 1) {
        let currentRecord = new Object;
        let currentLine = csv.toArray(line);
        for (let i = 0; i < 4; i++) {
          if (i < 2 || i === 3) {
            currentRecord[keyList[i]] = parseInt(currentLine[i]);
          } else {
            currentRecord[keyList[i]] = currentLine[i];
          }
        }
        skuList.push(currentRecord);
      }
    });

    rl.on('close', function() {
      console.log('3');
      resolve(skuList);
    })
  })
}

async function addPhotosToStyles() {

  return new Promise((resolve, reject) => {

    let resultSet = [];
    let tempSet = [];

    do {
      let workingSet = styleList.splice(0, 100000);
      tempSet = resultSet;
      let loopStart = photoList.findIndex(({styleId}) => styleId === workingSet[0].id) || 0;
      console.log({loopStart});

      for (let i = loopStart; i < photoList.length; i++) {
        let target = workingSet.find(({id}) => id === photoList[i].styleId);
        if (target) {
          let currentPhotos = photoList[i];
          target.photos.push(currentPhotos);
        } else {
          break;
        }
      }

    console.log('tempset count: ', tempSet.length);
    resultSet = tempSet.concat(workingSet);

    } while (styleList.length > 0);

    styleList = resultSet;
    console.log('4');
    resolve(resultSet);
  })
}

async function addSkusToStyles() {

  photoList = null;

  return new Promise((resolve, reject) => {

    let fileToWrite = path.join(filePath, '../.././data/finalStyleList.json');
    let writerStream = fs.createWriteStream(fileToWrite);

    do {

      let workingSet = styleList.splice(0, 100000);

      let loopStart = skuList.findIndex(({styleId}) => styleId === workingSet[0].id) || 0;
      console.log({loopStart});

      for (let i = loopStart; i < skuList.length; i++) {
        let target = workingSet.find(({id}) => id === skuList[i].styleId);
        if (target) {
          let currentSkus = skuList[i];
          target.skus[skuList[i].id] = {quantity: skuList[i].quantity, size: skuList[i].size}
        } else {
          break;
        }
      }

      for (let i = 0; i < workingSet.length; i++) {
        writerStream.write(JSON.stringify(workingSet[i]) + '\r\n');
      }

    } while (styleList.length > 0);

    writerStream.end();

    writerStream.on('finish', function() {
      console.log('write completed');
    });

    writerStream.on('error', function(err) {
      console.log(err.stack);
    });

    console.log('5');
    resolve('next');
  })
}

async function importProduct() {

  skuList = null;

  const newFilePath = (path.join(filePath, '../.././data/product.csv'));

  const instream = fs.createReadStream(newFilePath);
  const outstream = new stream();
  const rl = readline.createInterface(instream, outstream);
  const keyList = ['id', 'name', 'slogan', 'description', 'category', 'default_price', 'features'];

  return new Promise((resolve, reject) => {
    let lineCount = 0;

    rl.on('line', function(line) {

      lineCount++;
      if (lineCount > 1) {
        let currentRecord = new Object;
        let currentLine = csv.toArray(line);

        for (let i = 0; i < 7; i++) {

          if (i > 0 && i < 5) {
            currentRecord[keyList[i]] = currentLine[i];
          } else if (i < 1 || i === 5) {
            currentRecord[keyList[i]] = parseInt(currentLine[i]);
          } else if (i > 5) {
            currentRecord['features'] = new Array;
            currentRecord['styles'] = new Array;
          }

        }
        mainList.push(currentRecord);
      }
    });

    rl.on('close', function() {
      console.log('6');
      resolve(mainList);
    })
  })

}

async function importFeatures() {
  const newFilePath = (path.join(filePath, '../.././data/features.csv'));
  const instream = fs.createReadStream(newFilePath);
  const outstream = new stream();
  const rl = readline.createInterface(instream, outstream);

  const keyList = ['id', 'product_id', 'feature', 'value'];

  return new Promise((resolve, reject) => {
    let lineCount = 0;

    rl.on('line', function(line) {
      lineCount++;
      if (lineCount > 1) {
        let currentFeature = new Object;
        let currentLine = csv.toArray(line);
        for (let i = 1; i < 4; i++) {
          if (i === 1) {
            currentFeature[keyList[i]] = parseInt(currentLine[i]);
          } else {
            currentFeature[keyList[i]] = currentLine[i];
          }
        }
        featureList.push(currentFeature);
      }
    });

    rl.on('close', function() {
      console.log('7');
      resolve(featureList);
    })
  })
}

async function addFeaturesToProducts() {

  let resultSet = [];
  let tempSet = [];

  return new Promise((resolve, reject) => {

    do {
      let workingSet = mainList.splice(0, 100000);
      tempSet = resultSet;
      let loopStart = featureList.findIndex(({product_id}) => product_id === workingSet[0].id) || 0;
      console.log({loopStart});

      for (let i = loopStart; i < featureList.length; i++) {
        let target = workingSet.find(({id}) => id === featureList[i].product_id);
        if (target) {
          let currentFeatures = featureList[i];
          target.features.push(currentFeatures);
        } else {
          break;
        }
      }

    console.log('tempset count: ', tempSet.length);
    resultSet = tempSet.concat(workingSet);

    } while (mainList.length > 0);

    console.log('8');
    mainList = resultSet;
    resolve('next');
  })
}

async function writeProductFile(response) {

  styleList = null;
  featureList = null;

  let fileToWrite = path.join(filePath, '../.././data/finalProductList.json');
  let writerStream = fs.createWriteStream(fileToWrite);

  for (let i = 0; i < mainList.length; i++) {
    writerStream.write(JSON.stringify(mainList[i]) + '\r\n');
  }

  writerStream.end();

  writerStream.on('finish', function() {
    console.log('write completed');
  });

  writerStream.on('error', function(err) {
    console.log(err.stack);
  });

};

function runAllStyleStuff() {

  importStyles()
  .then(function(response) {
    return importPhotos(response);
  })
  .then(async function(response) {
    return importSkus(response);
  })
  .then(async function(response) {
    return addPhotosToStyles(response);
  })
  .then(async function(response) {
    return addSkusToStyles(response);
  })
  .catch((error) => {
    console.log('error: ', error)
  })
}

function runFinalBuild() {
  importProduct()
  .then(async function(response) {
    return importFeatures(response);
  })
  .then(async function(response) {
    return addFeaturesToProducts(response);
  })
  .then(async function(response) {
    return writeProductFile(response);
  })
  .catch((error) => {
    console.log('error: ', error)
  })
}

//uncomment below line to build style file to populate db.
runAllStyleStuff();

//uncomment line below to build products file to populate db.
//runFinalBuild();
