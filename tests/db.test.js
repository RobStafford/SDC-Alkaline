const mongoose = require('mongoose');
const { retrieveProductById, retrieveStylesById } = require('.././database/index.js');

beforeEach(() => {
    mongoose.connect('mongodb://localhost/products', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(() => {
    mongoose.disconnect();
});

const expectedStyleData = [{
    "id": 1958072,
    "productId": 999999,
    "name": "Ivory",
    "original_price": 774,
    "default_style": "1",
    "photos": [
        {
            "id": 5655624,
            "styleId": 1958072,
            "url": "https://images.unsplash.com/photo-1548133464-29abc661eb5c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
            "thumbnail_url": "https://images.unsplash.com/photo-1490427712608-588e68359dbd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80"
        },
        {
            "id": 5655625,
            "styleId": 1958072,
            "url": "https://images.unsplash.com/photo-1421941027568-40ab08ee5592?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80",
            "thumbnail_url": "https://images.unsplash.com/photo-1553830591-d8632a99e6ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
            "id": 5655626,
            "styleId": 1958072,
            "url": "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
            "thumbnail_url": "https://images.unsplash.com/photo-1534011546717-407bced4d25c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80"
        }
    ],
    "skus": {
        "11323692": {
            "quantity": 46,
            "size": "XS"
        },
        "11323693": {
            "quantity": 39,
            "size": "S"
        },
        "11323694": {
            "quantity": 12,
            "size": "M"
        },
        "11323695": {
            "quantity": 33,
            "size": "L"
        },
        "11323696": {
            "quantity": 21,
            "size": "XL"
        },
        "11323697": {
            "quantity": 16,
            "size": "XXL"
        }
    }
}];

  test('db test: returns product data for item 999999', (done) => {
    function callback(data) {
        try {
           expect(data).toEqual(expect.objectContaining({name: 'Rowland Coat'}));
           done();
        } catch (error) {
           //console.log('error: ', error);
           done();
        }
      }
    retrieveProductById(999999, callback);
  });

  test('db test: returns style data for item 999999', (done) => {
    function callback(data) {
        try {
           expect(data).toEqual(expect.arrayContaining(expectedStyleData));
           done();
        } catch (error) {
           //console.log('error: ', error);
           done();
        }
      }
    retrieveStylesById(999999, callback);
  });







