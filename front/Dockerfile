# Étape 1 : Build du front
FROM node:22-alpine AS builder

# Crée le dossier de travail
WORKDIR /app

# Installer pnpm globalement
RUN npm install -g pnpm

# Copie les fichiers nécessaires au build
COPY index.html ./
COPY package*.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY tsconfig.json tsconfig.app.json ./
COPY public ./public
COPY src ./src

# Installe les dépendances
RUN pnpm install

# Lance le build
RUN pnpm run build

# Étape 2 : Serveur NGINX pour héberger le site statique
FROM nginx:alpine

# Copie les fichiers statiques depuis le build précédent
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose le port utilisé par NGINX
EXPOSE 80
