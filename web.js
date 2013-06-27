var fs = require('fs'),
  http = require('http'),
  nowjs = require('now');

var server = http.createServer(function(req, response)
{
  var route = {

    /* ROUTE PAGES */
    '/': ['/index.html', 'text/html'],
    '/shutter': ['/shutter.html', 'text/html'],

    /* SCRIPTS */
    '/js/jquery.js': ['/js/jquery.js', 'text/javascript'],
    //'/js/underscore.js': ['/js/underscore.js', 'text/javascript'],

    /* STYLES */
    //'/css/glove.css': ['/css/glove.css', 'text/css'],

    /* IMAGES */
    '/img/camera.png': ['/img/camera.png', 'image/png'],
    '/img/tv.png': ['/img/tv.png', 'image/png'],
    '/img/checkmark_green.png': ['/img/checkmark_green.png', 'image/png'],
    '/img/checkmark_white_1.png': ['/img/checkmark_white_1.png', 'image/png'],
    '/img/checkmark_white_2.png': ['/img/checkmark_white_2.png', 'image/png'],
    '/img/checkmark_white_3.png': ['/img/checkmark_white_3.png', 'image/png'],

  }[req.url];

  if (route != undefined){
    var type = (route[1] || 'text/plain');
    fs.readFile(__dirname+route[0], function(err, data){
        response.writeHead(200, {'Content-Type':type});
        response.write(data);
        response.end();
    });
  }
  else{
    response.writeHead(404, {'Content-Type': 'text/plain'});
      response.end("Page Could Not Be Found");
  }

});
server.listen(process.env.PORT || 8080);

var nowjs = require("now");
var everyone = nowjs.initialize(server);


nowjs.on('connect', function(){
  this.now.room = "room 1";
  nowjs.getGroup(this.now.room).addUser(this.user.clientId);
  console.log("Joined: " + this.now.name);
});

nowjs.on('disconnect', function(){
  console.log("Left: " + this.now.name);
});

everyone.now.changeRoom = function(newRoom){
  this.now.distributeMessage("[leaving " + this.now.room + "]");
  nowjs.getGroup(this.now.room).removeUser(this.user.clientId);
  nowjs.getGroup(newRoom).addUser(this.user.clientId);
  this.now.room = newRoom;
  this.now.distributeMessage("[entering " + this.now.room + "]");
  var that = this;
  nowjs.getGroup(this.now.room).count(function(count){
    var prettyCount = (count === 1) ? "Room is empty." : (count - 1) + " other(s) in room.";
    that.now.receiveMessage("SERVER", "You're now in " + that.now.room + ". " + prettyCount);
  });
}

everyone.now.distributeMessage = function(message){
  nowjs.getGroup(this.now.room).now.receiveMessage(this.now.name, message);
};