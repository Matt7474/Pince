FROM node:18

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm install --include=dev

COPY . .

RUN npm run build

CMD ["node", "dist/index.js"]
