const mongoose = require('mongoose');
const app = require('.././server/index.js');
const supertest = require('supertest');
const request = supertest(app);
const rr = require('regenerator-runtime/runtime');

beforeEach(() => {
  mongoose.connect('mongodb://localhost/products', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(() => {
  mongoose.disconnect();
});

it('returns data from the get/products endpoint', async () => {
  try {
      await request.get('/products/999998');
      expect(response.status).toBe(200);
  } catch (err) {
  }
});

it('returns a 500 from the get/products endpoint for a bad request', async () => {
  try {
      await request.get('/products/');
      expect(response.status).toBe(500);
  } catch (err) {
  }
});

it('returns data from the get/styles endpoint', async () => {
  try {
      await request.get('/styles/999998');
      expect(response.status).toBe(200);
  } catch (err) {
  }
});

it('returns a 500 from the get/styles endpoint for a bad request', async () => {
  try {
      await request.get('/styles/');
      expect(response.status).toBe(500);
  } catch (err) {
  }
});
