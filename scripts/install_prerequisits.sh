#!/bin/bash

# Ubuntu 18 machine

sudo apt update

# Docker and docker-compose
sudo apt install docker docker-compose -y
sudo shutdown now -r # needed for next line to take effect
sudo usermod -aG docker ${USER}
sudo shutdown now -r # needed for previous line to take effect

# nvm with node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
# Close and open terminal again
nvm install v14.15.0

npm install -g serve

git clone https://github.com/Conscious-Cities/civic-participation.git
cd civic-participation