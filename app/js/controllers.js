'use strict';

angular.module('castApp.controllers', [])
  .controller('CalleeCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'castService', function($scope, $state, $stateParams, $timeout, castService) {

    var pc = null;
    castService.setMessageHandler(function(from, message) {
      console.log('from: '+from+' message: '+JSON.stringify(message));

      if (message.offer) {
      	var remoteDescription = new RTCSessionDescription({ "type": "offer", "sdp": message.offer});
        pc = new RTCPeerConnection(null);

        pc.onicecandidate = function(event) {
    	  if (event.candidate) {
    	    castService.sendMessage(from, { candidate: event.candidate });
    	  }
        }
        pc.onaddstream = function(event) {
	  if (event.stream) {
	    var video = document.getElementById('remoteVideo');
	    attachMediaStream(video, event.stream);
	  }
        }

	pc.oniceconnectionstatechange = function(event) {
          var state = event;
	  if (event.target && event.target.iceConnectionState) {
	    state = event.target.iceConnectionState;
          }
	  if ((state == "disconnected") || (state == "closed")) {
	    var video = document.getElementById('remoteVideo');
	    video.src = "";
    	  }
    	}

        pc.setRemoteDescription(
          remoteDescription,
          function() {
            pc.createAnswer(
              function(localDescription) {
                localDescription.sdp = localDescription.sdp;
                pc.setLocalDescription(
                  localDescription,
                  function() {
            	    castService.sendMessage(from, { answer: localDescription.sdp });
                  },
                  function(error) {
            	    castService.sendMessage('log', error);
                castService.sendMessage('log', localDescription.sdp);
        	    console.log(error);
                  }
                );
              },
              function(error) {
                castService.sendMessage('log', error);
		console.log(error);
              }
            ); 
          },
          function(error) {
            castService.sendMessage('log', error);
                castService.sendMessage('log', remoteDescription.sdp);
            console.log(error);
          }
        );
      } else if (message.candidate) {
	var candidate = new RTCIceCandidate(message.candidate);
	pc.addIceCandidate(candidate);
      }
    });
  }])

  .controller('CallerCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'castService', function($scope, $state, $stateParams, $timeout, castService) {
    castService.setScope($scope);
    $scope.destination = null;
    var pc = null;
    var localStream = null;
    var isInCall = false;

    $scope.isCallDisabled = function() {
	return isInCall;
    }

    $scope.isHangupDisabled = function() {
	return !isInCall;
    }

    $scope.hangup = function() {
	isInCall = false;
	if (pc) {
	    pc.close();
	    pc = null;
	    localStream.stop();
	    localStream = null;
	}
    }
    
    $scope.call = function() {
      if ($scope.destination == null) {
        return;
      }

      console.log("call")
      isInCall = true;;
      pc = new RTCPeerConnection(null);
      
      getUserMedia(
        {audio: true, video: true},
        function(stream) {
	  castService.setMessageHandler(function(from, message) {
    	    if (message.answer) {
      	      var remoteDescription = new RTCSessionDescription({ "type": "answer", "sdp": message.answer});
      	      pc.setRemoteDescription(
      	        remoteDescription,
      	        function() {
      	        },
      	        function(error) {
        	  console.log(error);
        	  pc = null;
        	  isInCall = false;
      	        }
      	      );
	    } else if (message.candidate) {
		var candidate = new RTCIceCandidate(message.candidate);
		pc.addIceCandidate(candidate);
	    }
	  });

	  localStream = stream;
	  pc.addStream(localStream);
          pc.onicecandidate = function(event) {
            if (event.candidate) {
    	     castService.sendMessage($scope.destination, { candidate: event.candidate });
    	    }
          }
    	  pc.createOffer(
    	    function(localDescription) {
    	      localDescription.sdp = localDescription.sdp;
    	      pc.setLocalDescription(
    	        localDescription,
    	        function() {
    	          castService.sendMessage($scope.destination, { offer: localDescription.sdp });
    	        },
    	        function(error) {
        	  console.log(error);
        	  pc = null;
        	  isInCall = false;
    	        }
    	      );
    	    },
    	    function(error) {
              console.log(error);
    	      isInCall = false;
    	    },
    	    { mandatory: { OfferToReceiveAudio: false, OfferToReceiveVideo: false } }
    	  );
        },
        function(error) {
    	  console.log(error);
    	  isInCall = false;
        }
      );
    }

  }])



