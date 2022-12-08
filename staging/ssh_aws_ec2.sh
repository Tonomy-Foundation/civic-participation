#!/bin/bash

chmod 400 ./keys/ec2.pem
ssh -v -i ./keys/ec2.pem ubuntu@ec2-35-180-242-177.eu-west-3.compute.amazonaws.com