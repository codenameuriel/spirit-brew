const express = require('express');
const hbs = require('hbs');

const app = express();
const port = 9000;

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});