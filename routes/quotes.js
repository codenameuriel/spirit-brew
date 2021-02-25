const http = require('http');
const express = require('express');
const router = express.Router();

router.get('/', (request, response, next) => {
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
      console.log(data);
      if (data.error) {
        // handle error.message
        console.error(data.error.message);
      } else {
        const quote = data.contents.quotes[0].quote;
        console.log(quote);
        // handle quote
        response.render('index', {
          title: 'Welcome to Spirit Brew',
          quote
        });
      }
    });

    res.on('error', err => {
      console.log(err, 'response error');
    });
  });

  req.on('error', err => console.log(err, 'request error'))
  req.end();
});

module.exports = router;