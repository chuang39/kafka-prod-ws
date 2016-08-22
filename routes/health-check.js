var express = require('express');
var router = express.Router();

/* Insert message to kafka */
router.get('/', function(req, res, next) {
  //console.log("kafka-prod: health check ok.")

  res.send('kafka-prod: health check ok.');
});

module.exports = router;