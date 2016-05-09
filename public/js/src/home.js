$(document).ready(function() {
  $('#container').masonry({
      itemSelector: '.listing',
      isFitWidth: true
  });

  $('.post-rating').raty();

  $('#gotonext').click(function() {
    // console.log('adsf');
    var ret = confirm("Submit Feedback? This feedback cannot be retracted.");
    if (ret === true)
      window.location.href = '/'
  });

  particlesJS.load('particles-js', 'js/lib/particles.json', function() {});
});