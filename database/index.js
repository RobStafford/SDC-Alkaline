var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/products', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ProductSchema = mongoose.Schema({

  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number,
  features: {
    type: Array,
    default: undefined
  },
  styles: {
    type: Array,
    default: undefined
  }
});

const StyleSchema = mongoose.Schema({

  id: Number,
  productId: Number,
  name: String,
  sale_price: Number,
  original_price: Number,
  default_style: String,
  photos: {
    type: Array,
    default: undefined
  },
  skus: {
    type: Object,
    default: undefined
  }
});

let Product = mongoose.model('product', ProductSchema, 'products');
let Style = mongoose.model('style', StyleSchema, 'styles');

async function retrieveProductById(incomingId, callback) {

  const query  = Product.where({ id: incomingId });
  query.findOne(function (error, product) {
    if (error) {
      console.log('db error: ', error);
      callback(error);
    }
    if (product) {
      callback(null, product);
    }
  });
}

async function retrieveStylesById(incomingId, callback) {

  const query  = Style.where({ productId: incomingId });
  query.find(function (error, styles) {
    if (error) {
      console.log('db error: ', error);
      callback(error);
    }
    if (styles) {
      callback(null, styles);
    }
  });
}

module.exports = {
  retrieveProductById,
  retrieveStylesById
}
