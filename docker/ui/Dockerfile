FROM node:lts-jessie as build

RUN mkdir /opt/app
WORKDIR /opt/app

COPY package.json /opt/app/package.json

RUN npm install --silent

COPY . /opt/app

RUN npm run build

FROM node:lts-alpine
RUN mkdir /opt/app
WORKDIR /opt/app

RUN npm install serve -g --silent

COPY --from=build /opt/app/build /opt/app/build

EXPOSE 5000
CMD [ "serve","-s", "build" ]

