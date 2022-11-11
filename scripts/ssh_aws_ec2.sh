#!/bin/bash

chmod 400 ./keys/ec2.pem
ssh -v -i ./keys/ec2.pem ubuntu@ec2-35-180-242-177.eu-west-3.compute.amazonaws.com
make sure ports 22, 3000, 4000, 8080, 8081 and 8888 are open

Then check the settings in the settings.jsons

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
