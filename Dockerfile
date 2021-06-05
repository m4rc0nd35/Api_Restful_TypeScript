FROM node:14-buster-slim
WORKDIR  /build
EXPOSE 80:8080
COPY ./build /build
RUN npm install
CMD ["npm","start"]