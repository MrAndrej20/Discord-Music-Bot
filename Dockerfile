FROM node:8-alpine
ADD . /app
RUN cd /app; npm install --production
CMD ["node", "/app/service/dst/index.js"]