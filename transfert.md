./deploy.sh

<!-- # 1️⃣ Recréer une archive propre (depuis la racine du projet)
tar czf pince-stack.tar.gz back/ docker-compose.yml

# 2️⃣ Envoyer cette archive vers ton VPS (dans le dossier cible)
scp pince-stack.tar.gz root@217.154.15.118:/root/pince-stack/

# 3️⃣ Te connecter à ton VPS
ssh root@217.154.15.118

# 4️⃣ Te placer dans le dossier où tu as envoyé l’archive
cd /root/pince-stack

# Puis l’extraire
tar xzf pince-stack.tar.gz

docker system prune -a --volumes

docker-compose down --volumes
docker-compose build --no-cache
docker-compose up -d
 -->
