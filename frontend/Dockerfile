FROM node:20.11.1-alpine3.19
# RUN addgroup app && adduser -S -G app app
# USER app

WORKDIR /app
COPY package*.json ./
RUN npm install --save -dev
COPY . .


# Build for production.
RUN npm run build

# Install `serve` to run the application.
RUN npm install -g serve

CMD ["serve", "-s", "build"]