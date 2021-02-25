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
      console.log(data.contents);
      if (data.error) {
        const { error } = data;
        // handle error.message
        console.error(error.message);
        next(error);
      } else {
        const { quote, author } = data.contents.quotes[0];
        console.log(quote);
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
});

module.exports = router;