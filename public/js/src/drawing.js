/**
 * Canvas Size Configuration
 */
var canvasWidth = $(".room-draw-view").width();
var canvasHeight = $(".room-draw-view").height();
view.viewSize = [(canvasWidth), (canvasHeight)];

// Create a new path once, when the script is executed:
var myPath = new Path();
myPath.strokeColor = 'black';
tool.maxDistance = 20;

// every time the user drags their mouse
// this function will be executed
function onMouseDrag(event) {
    // Take the click/touch position as the centre of our circle
    var x = event.middlePoint.x;
    var y = event.middlePoint.y;
    // The faster the movement, the bigger the circle
    var radius = event.delta.length / 3;
    // Generate our random color
    // Draw the circle
    var color = randomColor();
    drawCircle( x, y, radius, color );
    // Pass the data for this circle
    // to a special function for later
    emitCircle( x, y, radius, color );
}

// Returns an object specifying a semi-random color
// The color will always have a red value of 0
// and will be semi-transparent (the alpha value)
function randomColor() {
    return {
        red: 0,
        green: Math.random(),
        blue: Math.random(),
        alpha: ( Math.random() * 0.25 ) + 0.05
    };
}

function drawCircle( x, y, radius, color ) {
  var circle = new Path.Circle( new Point( x, y ), radius );
  circle.fillColor = new RgbColor( color.red, color.green, color.blue, color.alpha );
  view.draw();
}

function emitCircle( x, y, radius, color ) {
  var sessionId = socket.sessionid;

  // An object to describe the circle's draw data
  var data = {
      x: x,
      y: y,
      radius: radius,
      color: color
  };

  // send a 'drawCircle' event with data and sessionId to the server
  socket.emit( 'drawCircle', data, sessionId )

  // Lets have a look at the data we're sending
  console.log( data )
}

socket.on( 'drawCircle', function( data ) {
  console.log( 'drawCircle event recieved:', data );
  drawCircle( data.x, data.y, data.radius, data.color );
})