#!/bin/bash

# install civic-participation
cd civic-participation/
./app.sh stop
git pull
./app.sh install
./app.sh start prod    OR
./app.sh init prod            (if you need to reset blockchain or recompile contracts)
check services run correctly with:
./app.sh logs [service]

# install nginx and configure
sudo apt install -y nginx
cp ./nginx.conf /etc/nginx/conf.d/default.conf
sudo systemctl restart nginx

# check ports and permissions
echo " I am starting "
echo " AM I ROOT?"
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi
echo " I am root"

echo 'Checking if ports are open'

if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null ; then
    echo "80 is open running"
else
    echo "80 not open"
fi

if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "8080 is open"
else
    echo "8080 not open"
fi

if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null ; then
    echo "4000 is open"
else
    echo "4000 not open"
fi

if lsof -Pi :22 -sTCP:LISTEN -t >/dev/null ; then
    echo "22 is open"
else
    echo "22 not open"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "3000 is open"
else
    echo "3000 not open"
fi

if lsof -Pi :8888 -sTCP:LISTEN -t >/dev/null ; then
    echo "8888 is open"
else
    echo "8888 not open"
fi

if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "8081 is open"
else
    echo "8081 not open"
fi


# update settings in front-end/src/settings.json and scripts/helpers.sh
WAN=`dig +short myip.opendns.com @resolver1.opendns.com`
echo "your wan ip is $WAN"

echo ' You now need to make changes to the front-end/src/settings.json file ' 

echo ' try to make it look like '
varnew=`if (process.env.REACT_APP_NODE_ENV === "production") {
     settings.env = "production"
     settings.eosio.nodeos = "http://${WAN}:4000";
     settings.dfuseOptions.network = "";
     settings.eosio.blockExplorerUrl = "http://${WAN}:8080";
     settings.dfuseOptions.network = "{$WAN}:4000"
     settings.dfuseOptions.secure = false;
}`

echo ' You may need to update the Google Maps Javascript API key also in front-end/src/settings.json file'
echo ' get it here https://developers.google.com/maps/documentation/javascript/get-api-key'

echo ' try to make it look like '
echo `google: {
        apiKey: "New API key here"
    },`

echo $varnew

echo ' You now need to make changes to the scripts/helpers.sh file ' 
echo ' try to make it look like '

varnew=`if [ "\${ARG1}" \=\= "prod" ]\; \then
        EOSQ_ENDPOINT_URL="http://${WAN}:8080" docker-compose up -d
    else
        EOSQ_ENDPOINT_URL="localhost:8080" docker-compose up -d
    fi`

echo $varnew
