#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

DEPLOY_PATH="/home/mahefcuw/writingtest.ieltsprepandpractice.com"

echo -e "${GREEN}Starting deployment...${NC}"

cd $DEPLOY_PATH

echo -e "${YELLOW}Fetching latest code from GitHub...${NC}"
git fetch origin main
git checkout main
git reset --hard origin/main
git pull origin main

echo -e "${GREEN}Deployment completed!${NC}"
