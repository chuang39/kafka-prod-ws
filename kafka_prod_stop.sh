#!/bin/sh
#sudo docker stop $(sudo docker ps -q  --filter "ancestor=khuang/kafka-prod")
sudo kill -9 $(pgrep node)
