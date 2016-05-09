var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,

  facebook: String,
  tokens: Array,

  profile: {
    name: { type: String, default: 'Dummy Name' },
    tagline: { type: String, default: 'Teaching and learning should be accessible. I\'m just a learner. I\'m a student. I\'d love to meet you too! Pair with me and let\'s chat' },
    location: { type: String, default: 'San Francisco, CA' },
    website: { type: String, default: 'mysite.me' },
    picture: { type: String, default: '' },
    rating: { type: Number, default: 100 }
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});



/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function(size) {
  if (!size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

userSchema.methods.addRating = function(rating) {
  var user = this;
  user.rating = (user.rating * (user.numberOfReviews / (user.numberOfReviews + 1))) + (rating / (1 / (user.numberOfReviews + 1)));
  user.numberOfReviews += 1;
}

module.exports = mongoose.model('User', userSchema);
