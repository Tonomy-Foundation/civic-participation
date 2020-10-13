#!/bin/bash

PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

WORKING_DIR="/tmp"
CONTRACT_NAME="dfuseiohooks"
docker run -v "${PARENT_PATH}:${WORKING_DIR}" eostudio/eosio.cdt:v1.7.0 eosio-cpp -abigen -I ${WORKING_DIR}/include -R resource -contract ${CONTRACT_NAME} -o ${WORKING_DIR}/${CONTRACT_NAME}.wasm ${WORKING_DIR}/src/${CONTRACT_NAME}.cpp