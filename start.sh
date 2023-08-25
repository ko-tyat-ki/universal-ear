#!/bin/bash
sudo truncate -s 0 /var/log/syslog
. /home/pi/.nvm/nvm.sh
npm run prod
