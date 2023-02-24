FROM node:12
WORKDIR /app
RUN npm install
RUN npx sequelize-cli db:migrate
