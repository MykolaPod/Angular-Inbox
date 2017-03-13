FROM node:latest

RUN mkdir /src

WORKDIR /src
COPY . /src

RUN npm install

RUN npm install gulp -g
RUN npm install bower -g

RUN bower install --allow-root

RUN gulp build

EXPOSE 8000

CMD ["npm", "start"]