#!/bin/bash

ARCHIVE_NAME="pince-stack.tar.gz"
REMOTE_USER="root"
REMOTE_HOST="217.154.15.118"
REMOTE_DIR="/root/pince-stack"

scp -i ~/.ssh/id_rsa $ARCHIVE_NAME $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/

ssh -i ~/.ssh/id_rsa $REMOTE_USER@$REMOTE_HOST << EOF
  cd $REMOTE_DIR
  tar xzf $ARCHIVE_NAME
  docker system prune -a --volumes -f
  docker-compose down --volumes
  docker-compose build --no-cache
  docker-compose up -d
EOF


# #!/bin/bash

# ARCHIVE_NAME="pince-stack.tar.gz"
# REMOTE_USER="root"
# REMOTE_HOST="217.154.15.118"
# REMOTE_DIR="/root/pince-stack"

# tar czf $ARCHIVE_NAME back/ docker-compose.yml
# scp $ARCHIVE_NAME $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/

# ssh $REMOTE_USER@$REMOTE_HOST << EOF
#   cd $REMOTE_DIR
#   tar xzf $ARCHIVE_NAME
#   docker system prune -a --volumes -f
#   docker-compose down --volumes
#   docker-compose build --no-cache
#   docker-compose up -d
# EOF
