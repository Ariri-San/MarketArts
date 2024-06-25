FROM node:20.11.1-alpine3.19
# RUN addgroup app && adduser -S -G app app
# USER app

WORKDIR /app
COPY package*.json ./
# RUN npm install --save-dev
RUN npm ci
COPY . .

ENV CI=true
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]