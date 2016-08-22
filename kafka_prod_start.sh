#!/bin/sh
#sudo docker run -p 3000:3000 -d khuang/kafka-prod
cd /home/user/bidder/kafka-prod
#npm start > ~/bidder/kafka-prod/log.txt &
npm start > /dev/null 2>&1 &
