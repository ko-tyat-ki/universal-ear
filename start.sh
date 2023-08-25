#!/bin/bash
sudo truncate -s 0 /var/log/syslog
. /home/pi/.nvm/nvm.sh
npm run prod
python3 /home/kat/universal-ear/sound/run_sound.py
