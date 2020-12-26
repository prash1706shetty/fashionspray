FROM registry.access.redhat.com/ubi8/nodejs-12:latest

USER root

# Create app directory
WORKDIR /app
ENV HOME=/app
COPY . .
RUN chown -R 1001 /app

USER 1001

RUN npm install
RUN npm i dotenv

EXPOSE 3000
CMD [ "npm","start" ]
