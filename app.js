var connections = require('./backend/connections');
var conn = connections()

var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , app = express()
  , port = 2048;

app.use(function (req, res) {
  res.send({ msg: "hello" });
});

wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    var arr = message.split('\n');
    var i = 0;
    var topic_name = 'khuang';
    var bid_id = '0';
    var messages = [];
    for (i = 0; i < arr.length; i++) {
      if (arr[i] == "") {
        continue;
      }

      try {
        var request_json = JSON.parse(arr[i]);
        bid_id = request_json.bid_id;
        request_json.time_to_create = new Date().toISOString().
        replace(/T/, ' ').
        replace(/\..+/, '');
        request_json.time_to_create_epoch = new Date().getTime();
        request_string = JSON.stringify(request_json);
        messages.push(request_string)
      } catch(e) {
        console.log('error processing message', arr[i]);
        continue;
      }
    }

    if (messages.length === 0) {
      //json(res, 400, "Error: empty message received")
    } else {
      var  payloads = [
        { topic: topic_name, messages: messages, key: bid_id},
      ];

      conn.kafka_producer.send(payloads, function (err, data) {
        var msg = {result: 'OK'};
        if (err) {
          msg = {'result':'fail', 'data':err, 'index':i.toString()}
          console.log(msg);
        }
      });
    }

  });

  ws.send('OK');
});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });

module.exports = app;