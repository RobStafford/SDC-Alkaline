const app = require('./index.js');
const port = 3001;
app.listen(port, () => {
  console.log(`SDC server listening on http://localhost:${port}`)
})