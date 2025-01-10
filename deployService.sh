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
printf "\n----> Preparing deployment package\n"
rm -rf build
mkdir -p build/src

# 只复制源代码文件
printf "\n----> Copying source files...\n"
# 复制目录结构但排除 node_modules
find service -type d -not -path "*/node_modules/*" -not -name "node_modules" -exec mkdir -p "build/{}" \;

# 复制必要的源代码文件
find service \
    -type f \
    -not -path "*/node_modules/*" \
    -not -name "*.log" \
    -not -name ".DS_Store" \
    -not -name "*.test.js" \
    -not -name "*.spec.js" \
    -exec cp {} build/{} \;

# 确保创建必要的目录
mkdir -p build/service/logs

# 确保复制环境变量文件
if [ -f "service/.env.production" ]; then
    cp service/.env.production build/service/.env
else
    printf "\nWarning: No .env.production file found. Please ensure environment variables are properly set on the server.\n"
fi

# Step 2
printf "\n----> Clearing out previous distribution on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
mkdir -p services/${service}/logs
pm2 stop ${service} || true
ENDSSH

# Step 3
printf "\n----> Copy the distribution package to the target\n"
scp -r -i "$key" build/service/* build/service/.env ubuntu@$hostname:services/$service/

# Step 4
printf "\n----> Deploy the service on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
cd services/${service}
# 清理旧的 node_modules
rm -rf node_modules
# 安装新的依赖
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