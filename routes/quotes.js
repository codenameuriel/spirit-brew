const http = require('http');
const express = require('express');

const router = express.Router();

let { today, dateString } = require('../date');

// cache for requested quote
let fetchedQuote = null;

router.get('/', (req, res, next) => {
  // avoid exceeding api limit of 10 requests per hour
  // quote varies by day, so only need to fetch once per day
  if (!fetchedQuote || today.getDay() !== new Date().getDay()) {
    // update date
    today = new Date();

    // create a client request
    // URL object is converted into an options object by http.request
    const options = new URL('http://quotes.rest/qod.json?category=inspire');
    const quoteRequest = http.request(options);

    quoteRequest.on('response', quoteRes => {
      quoteRes.on('data', chunk => {
        const jsonData = chunk.toString();
        const parsedData = JSON.parse(jsonData);

        // pass down error to error handler
        if (parsedData.error) next(parsedData.error);
        else {
          const { quote, author } = parsedData.contents.quotes[0];
          fetchedQuote = { quote, author };
          // render hbs template
          res.render('index', {
            title: 'Welcome to Spirit Brew',
            quote,
            author,
            dateString
          });
        }
      });

      quoteRes.on('error', err => console.error(err, 'response error'));
    });

    quoteRequest.on('error', err => console.error(err, 'request error'));
    quoteRequest.end();
  } else {
    console.log('using cached quote data: fetchedQuote', fetchedQuote);
    // use cached quote data
    res.render('index', { 
      title: 'Welcome to Spirit Brew',
      dateString,
      ...fetchedQuote 
    });
  }
});

module.exports = router;
