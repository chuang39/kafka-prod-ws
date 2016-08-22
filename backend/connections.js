var EventEmitter = require('events').EventEmitter;
var kafka = require('kafka-node');


function Connector() {
  EventEmitter.call(this);

  var self = this;
  var Producer = kafka.Producer;
  var client = new kafka.Client("38.111.30.146:2181,38.111.30.147:2181,38.111.30.148:2181");

  this.kafka_producer = new Producer(client, {partitionerType: 3});
}

Connector.prototype = Object.create(EventEmitter.prototype);

module.exports = function(){return new Connector()};
