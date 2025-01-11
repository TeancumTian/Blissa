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
    printf "  syntax: deployReact.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n----> Deploying React bundle $service to $hostname with $key\n"

# Step 1
printf "\n----> Build the distribution package\n"
rm -rf build
mkdir build
npm install # make sure vite is installed so that we can bundle
npm run build # build the React front end
cp -rf dist/* build # move the React front end to the target distribution

# Step 2
printf "\n----> Clearing out previous distribution on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/${service}/public
mkdir -p services/${service}/public
ENDSSH

# Step 3
printf "\n----> Copy the distribution package to the target\n"
scp -r -i "$key" build/* ubuntu@$hostname:services/$service/public

# Step 5
printf "\n----> Removing local copy of the distribution package\n"
rm -rf build
rm -rf dist

# 添加部署确认
printf "\n当前部署目标: services/${service}/public\n"
read -p "确认继续部署? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

# 添加部署完成验证
printf "\n----> 验证部署结果\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
if [ -f "services/${service}/public/index.html" ]; then
    echo "部署成功: 找到 index.html"
else
    echo "部署失败: 未找到 index.html"
    exit 1
fi
ENDSSH

#./deployReact.sh -k ~/ssh BlissaJan2025.pem -h startup.blissa.app -s startup
