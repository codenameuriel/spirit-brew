const http = require('http');
const express = require('express');
const router = express.Router();

let fetchedQuote = null;

router.get('/', (request, response, next) => {
  // avoid exceeding api limit of 10 requests per hour
  // quote varies by day, so only need to fetch once
  if (!fetchedQuote) {
    const quoteUrl = new URL('http://quotes.rest/qod.json?category=inspire');
    const options = {
      host: quoteUrl.hostname,
      port: quoteUrl.port,
      path: quoteUrl.pathname,
      method: 'GET'
    };
    if (quoteUrl.search) options.path += `?${quoteUrl.search}`;

    const req = http.request(options);

    req.on('response', res => {
      res.on('data', chunk => {
        const json = chunk.toString();
        const data = JSON.parse(json);

        if (data.error) {
          const { error } = data;
          next(error);
        } else {
          const { quote, author } = data.contents.quotes[0];
          fetchedQuote = { quote, author };
          console.log('fetchedQuote', fetchedQuote);
          // handle quote
          response.render('index', {
            title: 'Welcome to Spirit Brew',
            quote,
            author
          });
        }
      });

      res.on('error', err => {
        console.log(err, 'response error');
      });
    });

    req.on('error', err => console.log(err, 'request error'))
    req.end();
  } else {
    console.log('using cached quote data: fetchedQuote', fetchedQuote);
    // use cached quote data
    response.render('index', { 
      title: 'Welcome to Spirit Brew',
      ...fetchedQuote 
    });
  }
});

module.exports = router;
