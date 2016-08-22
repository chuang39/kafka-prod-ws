FROM node:0.10.43

MAINTAINER Kevin Huang

RUN mkdir /src

# Install app dependencies
WORKDIR /src
ADD ./package.json /src/package.json
RUN npm install

ADD . /src/

EXPOSE 3000 
#CMD [ "npm", "start" i]
CMD npm start
