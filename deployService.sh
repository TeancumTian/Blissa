#!/bin/bash

# 添加错误处理
set -e  # 遇到错误立即退出
trap 'echo "Error occurred at line $LINENO. Exit code: $?"' ERR

while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployService.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n----> Deploying Service bundle $service to $hostname with $key\n"

# Step 1
printf "\n----> Build the distribution package\n"
rm -rf build
mkdir build
cp -rf service/* build/

# 确保复制环境变量文件
if [ -f "service/.env.production" ]; then
    cp service/.env.production build/.env
else
    printf "\nWarning: No .env.production file found. Please ensure environment variables are properly set on the server.\n"
fi

cd build && npm install --production
cd ..

# Step 2
printf "\n----> Clearing out previous distribution on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
mkdir -p services/${service}
pm2 stop ${service} || true
ENDSSH

# Step 3
printf "\n----> Copy the distribution package to the target\n"
scp -r -i "$key" build/* ubuntu@$hostname:services/$service/

# Step 4
printf "\n----> Deploy the service on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
cd services/${service}
npm install --production
pm2 delete ${service} || true
NODE_ENV=production pm2 start index.js --name ${service} \
    --max-memory-restart 1G \
    --log ./logs/app.log \
    --error ./logs/error.log \
    --time

# 检查服务是否成功启动
sleep 5
if pm2 show ${service} > /dev/null; then
    echo "Service successfully deployed and running"
else
    echo "Error: Service failed to start"
    exit 1
fi
ENDSSH

# Step 5
printf "\n----> Removing local copy of the distribution package\n"
rm -rf build

printf "\n----> Deployment completed successfully!\n"