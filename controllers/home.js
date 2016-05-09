var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var Listing = require('../models/Listing');
var secrets = require('../config/secrets');

/**
 * GET /home
 * *********
 * Homepage to explore possible students.
 */
exports.getHomePage = function(req, res) {
  if (!req.user) {
    res.render('index', {
      title: 'Helpful Hands'
    });
  } else {
    var listingsToPass = [];

    var numListings = 0;
    var counterListings = 0;

    Listing.count(function(err, count) {
      numListings = count;

      Listing.find({}, function(err, listings) {
        listings.forEach(function(listing) {
          User.findById(listing.creatorID, function(err, user) {
            if (user)
              listingsToPass.push({
                roomID: listing._id,
                title: listing.title,
                creatorID: listing.creatorID,
                tagline: listing.tagline,
                dateCreated: convertDate(listing.dateCreated),
                profile: user.profile
              });
            counterListings += 1

            if (counterListings === numListings)
              res.render('home', {
                title: 'Homepage',
                listings: JSON.stringify(listingsToPass)
              });
          });
        });
      });

      if (numListings === 0)
        res.render('home', {
          title: 'Homepage',
          listings: JSON.stringify(listingsToPass)
        });
    });
  }

  function convertDate(date) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    return [pad(date.getMonth()+1), pad(date.getDate()),date.getFullYear()].join('/');
  }
};

/**
 * GET /create/listing
 * *******************
 * Listing creation page.
 */
exports.getListingCreationPage = function(req, res) {
  res.render('create/create_listing', {
    title: 'Need Help'
  });
};

/**
 * POST /create/listing
 * ********************
 * Create a new listing.
 */
exports.postListingCreationPage = function(req, res) {
  req.assert('title', 'Must have a valid title').notEmpty();
  req.assert('description', 'Description must not be empty').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/create/listing');
  }

  var listing = new Listing({
    title: req.body.title,
    creatorID: req.user._id,
    tagline: req.body.description
  });

  Listing.findOne({ title: req.body.title }, function(err, existingListing) {
    if (existingListing) {
      req.flash('errors', { msg: 'Listing with that title already exists.' });
      return res.redirect('/create/listing');
    } else {
      listing.save(function(err) {
        if (err) return next(err);
        res.redirect('/room/' + listing._id);
      });
    }
  });
};