var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/products', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ProductSchema = mongoose.Schema({

  //_id: { type: Number, unique: true },
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

let Product = mongoose.model('product', ProductSchema);

let retrieveById = (id, callback) => {
  let query = Product.findById(id);
  query.exec((error, products) => {
    if (error) {
      callback(error);
    } else {
      callback(null, products);
    }
  })
}

module.exports = {
  retrieveById,
}
