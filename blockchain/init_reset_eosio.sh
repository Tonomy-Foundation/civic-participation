#!/bin/bash

ARG1=$1

set -u ## exit the script if you try to use an uninitialised variable
set -e ## exit the script if any statement returns a non-true return value

# Make sure working dir is same as this dir, so that script can be excuted from another working directory
PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$PARENT_PATH"

if [ "$ARG1" == "superfast" ]; then
    echo "Skipping contract compilation"
else
    echo "Compiling smart contract"

    cd "${PARENT_PATH}"
    cd ../contracts/eosio.bios
    ./build.sh

    cd ../civic
    ./build.sh

    echo ""
    echo "Smart contracts have been compiled"
    echo "You can run './app.sh init fast' next time to skip contract compilation (unless contracts have changed)"
    echo ""
fi

# allow for block production to start
echo "Waiting 10s for blockchain node to start"
sleep 10

docker-compose exec dfuse /bin/bash /var/repo/blockchain/activate_features.sh
if [ $? -gt 0 ]
then
    exit 1
fi

cd "${PARENT_PATH}"
cd ../back-end
npm run-script bootstrap
if [ $? -gt 0 ]
then
    exit 1
fi