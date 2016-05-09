var secrets = require('../config/secrets');
var querystring = require('querystring');
var validator = require('validator');
var async = require('async');
var cheerio = require('cheerio');
var request = require('request');
var graph = require('fbgraph');
var twilioAPI = require('twilio');
var Listing = require('../models/Listing');
var twilio = require('twilio')(secrets.twilio.sid, secrets.twilio.token);
var Y = require('yui/yql');
var _ = require('lodash');

/**
 * GET /room
 * Enter the room for video-chat.
 */
exports.getRoomPage = function(req, res) {
  var roomID = req.params.roomID;
  var userID = String(req.user._id);
  var accountSid = 'AC50b61476ea3fad16b180926f5821b942';

  // Use console-created signing key from Twilio Video.
  var signingKeySid = 'SK108d2268e9d53bd6a6710cfb935d775a';
  var signingKeySecret = 'wR6fixnoVUQRCsSjVUv4Utx1kkcLuQVN';

  var token = new twilioAPI.AccessToken(signingKeySid, accountSid, signingKeySecret);
  token.addEndpointGrant(userID);
  token.enableNTS();

  res.render('room/room', {
    title: 'Video Conferencing',
    roomID: roomID,
    userID: userID,
    token: token.toJwt()
  });
};


/**
 * GET /rate
 * Get the page for rating.
 */
exports.getRatePage = function(req, res) {
  res.render('room/rating', {
    title: "Rating Your Interaction"
  });
}


/**
 * POST /rate
 * Change the rating of a user.
 */
exports.postRatePage = function(req, res, next) {
  res.render('room/rating', {
    title: "Rating Your Interaction"
  });
}