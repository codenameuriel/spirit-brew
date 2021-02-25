const express = require('express');
const hbs = require('hbs');

const quotesRouter = require('./routes/quotes');

const app = express();
const port = 9000;

app.use(quotesRouter);

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
