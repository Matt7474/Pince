FROM node:22-alpine

WORKDIR /app

# Copie d'abord tout le code source
COPY . .

# Supprime node_modules s'il existe
RUN rm -rf node_modules

# Installe les dépendances
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]