var request = require('request');
var cheerio = require('cheerio');

/**
 * GET /
 * Index page.
 */
exports.getIndexPage = function(req, res) {
  if (!req.user) {
    res.render('index', {
      title: 'Helpful Hands'
    });
  } else {
    res.redirect('/home');
  }
};