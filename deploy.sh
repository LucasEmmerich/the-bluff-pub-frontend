#!/bin/bash
set -e

SERVER="root@187.45.254.170"

echo "Deploying frontend..."
ssh $SERVER "cd ~/bluff-pub/the-bluff-pub-frontend && git pull && docker compose up -d --build"

echo "Deploy concluido!"
