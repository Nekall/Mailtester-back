FROM node:18
WORKDIR /app
COPY . /app
RUN npm install
CMD ["npm", "start"]
EXPOSE 3333