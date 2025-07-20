
# 1️⃣ Recréer une archive propre (depuis la racine du projet)
tar czf pince-stack.tar.gz back/ docker-compose.yml

# 2️⃣ Envoyer cette archive vers ton VPS (dans le dossier cible)
scp pince-stack.tar.gz root@217.154.15.118:/root/pince-stack/

# 3️⃣ Te connecter à ton VPS
ssh root@217.154.15.118

# 4️⃣ Te placer dans le dossier où tu as envoyé l’archive
cd /root/pince-stack

# Puis l’extraire
tar xzf pince-stack.tar.gz

# 5️⃣ Reconstruire et relancer le conteneur backend
docker-compose up -d --build


<!-- en local 

tar --exclude='back/node_modules' -czvf pince_clean.tar.gz back docker-compose.yml

scp pince_clean.tar.gz root@217.154.15.118:/root/


sur ionos

 /root/docker-compose.yml




 # 1. Recréer l'archive
<!-- tar czf back.tar.gz back/ -->
tar czf pince-stack.tar.gz back/ docker-compose.yml

# 2. Envoyer vers le VPS
scp back.tar.gz root@217.154.15.118:/root/pince-stack/

# 3. Connecte-toi au VPS
ssh root@217.154.15.118

# 4. Extraire dans le bon dossier
cd /root/pince-stack


# 5. Rebuild le backend
docker-compose up -d --build
 -->

