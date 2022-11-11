#!/bin/bash

#chmod 400 ./keys/ec2.pem
#ssh -v -i ./keys/ec2.pem ubuntu@ec2-35-180-242-177.eu-west-3.compute.amazonaws.com

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


WAN=`dig +short myip.opendns.com @resolver1.opendns.com`
echo "your wan ip is $WAN"

echo ' You now need to make changes to the front-end/src/settings.json file ' 

echo ' it should look like this; 
 if (process.env.REACT_APP_NODE_ENV === "production") {
     settings.env = "production"
     settings.eosio.nodeos = "http://ec2-35-180-242-177.eu-west-3.compute.amazonaws.com:4000";
     settings.dfuseOptions.network = "";
     settings.eosio.blockExplorerUrl = "http://ec2-35-180-242-177.eu-west-3.compute.amazonaws.com:8080";
     settings.dfuseOptions.network = "ec2-35-180-242-177.eu-west-3.compute.amazonaws.com:4000"
     settings.dfuseOptions.secure = false;
 }
'
echo ' try to make it look like '
varnew="if (process.env.REACT_APP_NODE_ENV === "production") {
     settings.env = "production"
     settings.eosio.nodeos = "http://$WAN:4000";
     settings.dfuseOptions.network = "";
     settings.eosio.blockExplorerUrl = "http://$WAN:8080";
     settings.dfuseOptions.network = "$WAN:4000"
     settings.dfuseOptions.secure = false;
}"

echo $varnew

# TO DO NEED STRING BUILDER

wvarorignial="if (process.env.REACT_APP_NODE_ENV === "production") {
     settings.env = "production"
     settings.eosio.nodeos = "http://$WAN:4000";
     settings.dfuseOptions.network = "";
     settings.eosio.blockExplorerUrl = "http://$WAN:8080";
     settings.dfuseOptions.network = "$WAN:4000"
     settings.dfuseOptions.secure = false;
}"

#sed -i 's/$varoriginal/$varnew/'





#Then check the settings in the settings.jsons

# cd civic-participation/
# ./app.sh stop
# git pull
# ./app.sh install
# ./app.sh start prod    OR
# ./app.sh init prod            (if you need to reset blockchain or recompile contracts)
# check services run correctly with:
# ./app.sh logs [service]



# To set up for Ubuntu server (no SSL on Ubuntu)
# make sure ports 22, 3000, 4000, 8080, 8081 and 8888 are open
# you may want to run ./build.sh on each of the contracts manually, then run `./app.sh init fast`
# in front-end/src/settings.json
# if (process.env.REACT_APP_NODE_ENV === "production") {
#     settings.env = "production"
#     settings.eosio.nodeos = "http://ec2-35-180-242-177.eu-west-3.compute.amazonaws.com:4000";
#     settings.dfuseOptions.network = "";
#     settings.eosio.blockExplorerUrl = "http://ec2-35-180-242-177.eu-west-3.compute.amazonaws.com:8080";
#     settings.dfuseOptions.network = "ec2-35-180-242-177.eu-west-3.compute.amazonaws.com:4000"
#     settings.dfuseOptions.secure = false;
# }
# then `./app.sh start prod`
