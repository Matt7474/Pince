<!-- # Déploiement manuel sur Ionos -->
tar czf pince-stack.tar.gz back/ docker-compose.yml
scp pince-stack.tar.gz root@217.154.15.118:/root/pince-stack/
ssh root@217.154.15.118

cd /root/pince-stack
tar xzf pince-stack.tar.gz
docker system prune -a --volumes

docker-compose down --volumes
docker-compose build --no-cache
docker-compose up -d
<!-- # Fin déploiement manuel sur Ionos -->


<!-- # Remise du bon email en bdd -->
UPDATE users 
SET email = 'd.matt7@hotmail.fr' 
WHERE id = 1;
UPDATE 1

<!-- # Connexion a la bdd docker -->
docker exec -it pg16 psql -U pince_user -d pince_api