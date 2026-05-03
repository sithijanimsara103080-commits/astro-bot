FROM ghcr.io/puppeteer/puppeteer:latest

USER root
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Permissions for WhatsApp session
RUN chmod -R 777 /app

CMD ["node", "index.js"]
