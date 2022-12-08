#!/bin/bash

echo "updating /etc/hosts to redirect urls to localhost for testing"

echo "127.0.0.1 blockchainapi.staging.tonomy.foundation" | sudo tee -a /etc/hosts
echo "127.0.0.1 website.staging.tonomy.foundation" | sudo tee -a /etc/hosts
echo "127.0.0.1 expo.staging.tonomy.foundation" | sudo tee -a /etc/hosts

sudo cp ./nginx.conf /etc/nginx/conf.d/default.conf
sudo systemctl restart nginx