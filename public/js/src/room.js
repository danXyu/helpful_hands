$(document).ready(function() {

  $('#endCall').click(function() {
    var ret = confirm("Leave the session? Once you leave, you cannot comeback.");
    if (ret === true)
      window.location.href = '/rate'
  });


  /***************************/
  /* SOCKET.IO CONFIGURATION */
  /***************************/

  socket = io.connect('/');

  socket.on('connect', function() {
    socket.emit('adduser', {
      userID: userID,
      roomID: roomID
    });
  });


  /************************/
  /* TWILIO CONFIGURATION */
  /************************/

  var endpoint;
  var activeConversation;
  var previewMedia;

  if (!previewMedia) {
    previewMedia = new Twilio.LocalMedia();
    Twilio.getUserMedia().then(
      function (mediaStream) {
        previewMedia.addStream(mediaStream);
        previewMedia.attach('#video-preview-local');
      },
      function (error) {
        console.error('Unable to access local media', error);
        log('Unable to access Camera and Microphone');
      }
    );
  };

  if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia)
    alert('WebRTC is not available in your browser.');

  socket.on('setupchat', function() {
    console.log("It gets here");
    endpoint = new Twilio.Endpoint(accessToken);
    endpoint.listen().then(
      waitOnInvites,
      function (error) { console.log('Could not connect to Twilio: ' + error.message); }
    );
  });

  socket.on('invitechat', function(data) {
    console.log("It gets here invite");
    console.log(data);
    console.log(data.inviteID);
  // });
    endpoint = new Twilio.Endpoint(accessToken);
    endpoint.listen().then(
      initiateInvite(data.inviteID),
      function (error) { console.log('Could not connect to Twilio: ' + error.message); }
    );
  });

  function waitOnInvites() {
    console.log("Connected to Twilio. Listening for incoming Invites as '" + endpoint.address + "'");
    endpoint.on('invite', function (invite) {
      console.log('Incoming invite from: ' + invite.from);
      invite.accept().then(conversationStarted);
    });
  }

  function initiateInvite(inviteID) {
    console.log("Connected to Twilio. Inviting '" + inviteID + "'");
    console.log("It gets here");

    if (activeConversation) {
      activeConversation.invite(inviteID);
    } else {
      var options = {};
      if (previewMedia)
        options.localMedia = previewMedia;
      endpoint.createConversation(inviteID, options).then(
        conversationStarted,
        function (error) {
          console.error('Unable to create conversation', error);
        }
      );
    }
  }


  /**
   * Conversation Configuration
   */
  function conversationStarted(conversation) {
    console.log("It gets here starting");
    activeConversation = conversation;
    if (!previewMedia)
      conversation.localMedia.attach('#video-preview-local');

    // When: Someone else joins, draw their video to screen.
    conversation.on('participantConnected', function (participant) {
      console.log("Participant '" + participant.address + "' connected");
      participant.media.attach('#video-preview-external');
    });

    // When: Someone disconnects, note this in the console.
    conversation.on('participantDisconnected', function (participant) {
      console.log("Participant '" + participant.address + "' disconnected");
    });

    // When: Conversation ends, stop capturing local video and disconnect.
    conversation.on('ended', function (conversation) {
      console.log("Connected to Twilio. Listening for incoming Invites as '" + endpoint.address + "'");
      conversation.localMedia.stop();
      conversation.disconnect();
      activeConversation = null;
    });
  };
});