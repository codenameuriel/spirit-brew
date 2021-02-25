const express = require('express');
const hbs = require('hbs');
const path = require('path');

const quotesRouter = require('./routes/quotes');

const app = express();
const port = 9000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(quotesRouter);

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});

// error handler 
app.use((err, req, res, next) => {
  const { message } = err;
  res.render('error', { message });
});
