var express = require('express');
var router = express.Router();

var connections = require('../backend/connections');

var conn = connections()

var json = function(res, status, data) {
  res.set({
    'Content-Type': 'application/json; charset=utf-8'
  });
  if(typeof data === "string")
    res.status(status).send(data);
  else
    res.status(status).json(data);
};

/* Insert message to kafka */
router.post('/', function(req, res, next) {
  // console.log(req.body)

  var arr = req.body.split('\n');
  var i = 0;
  var topic_name = 'playable_events';
  var bid_id = '0';
  var messages = [];
  for (i = 0; i < arr.length; i++) {
    if (arr[i] == "") {
      continue;
    }

    try {
      var request_json = JSON.parse(arr[i])
      bid_id = request_json.bid_id;
      request_json.time_to_create = new Date().toISOString().
          replace(/T/, ' ').
          replace(/\..+/, '');
      request_json.time_to_create_epoch = new Date().getTime();
      request_string = JSON.stringify(request_json)
      messages.push(request_string)
    } catch(e) {
      console.log('error processing message', arr[i]);
      continue;
    }
  }

  if (messages.length === 0) {
    json(res, 400, "Error: empty message received")
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
      // console.log(data);
    });
    var msg = {result: 'OK'};
    json(res, 200, msg);
  }
});

module.exports = router;
