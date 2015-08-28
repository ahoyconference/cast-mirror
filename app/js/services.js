'use strict';

angular.module('castApp.services', [])
    .service('castService', ["$modal", function($modal) {
      var self = this;
      self.devices = [{ id: "", name: "Loading device list..."}];
      var socket = io();
      
      socket.on('id', function(id) {
	console.log('id: '+id);
	self.id = id;
      });

      socket.on('devices', function(devices) {
	self.devices = [];
	for (var i in devices) {
	    if (devices[i].id != self.id) {
		self.devices.push(devices[i]);
	    }
	}
	
	if (self.scope != null) {
	  self.scope.$apply(function() {
	    self.scope.devices = self.devices;
	  });
	}
      });

      self.scope = null;
      self.setScope = function(scope) {
        self.scope = scope;
        scope.devices = self.devices;
      }
      
      self.setMessageHandler = function(handler) {
	socket.on('message', function(from, payload) {
	    handler(from, payload);
	});
      }
      
      self.sendMessage = function(to, payload) {
        console.log("to "+to+" msg "+JSON.stringify(payload));
        socket.emit('message', to, payload);
      }
    }]);
