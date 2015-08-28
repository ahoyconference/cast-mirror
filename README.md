cast-mirror
===========

Minimalistic sample app to stream your WebRTC audio/video to a chromecast.

The app is build with grunt. Make sure you have grunt-cli installed ("npm install -g grunt-cli").
To install the neccessary dependencies run "npm install" once. Then you can build the app with "grunt".

Start the server with "node server.js". Then open "http://yourIp:3000/#/caller.html" on your desktop chrome.
Send your Chromecast to "http://yourIp:3000/#/callee.html", e.g. by using the GoCast Chomrecast app at http://kapejod.org/gocast/

Select your Chromecast and press "Call".
