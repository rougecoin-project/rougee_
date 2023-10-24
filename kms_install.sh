#!/bin/bash
rm docker-run.sh;
rm install-bash-lsb-native.sh;
rm install-bash-lsb-dock.sh;
rm install-bash-redhat-nginx-rtmp.sh;
rm install-bash-ubuntu-nginx-rtmp.sh;
rm install-bash-redhat-nginx-rtmp-run.sh;
rm -rf /var/kontackt_engine_conf;
rm -rf /var/kontackt_engine_conf_nginx_rtmp;

if [[ -f /etc/redhat-release ]]
then
sudo yum update
elif [[ -f /etc/lsb-release ]]
then
sudo apt-get update	
else
sudo dnf update
fi

. /etc/os-release

if [[ $NAME = "Ubuntu" ]] && [[ $VERSION_ID = "!18.04" ]] && [[ $VERSION_CODENAME = "bionic" ]]
then
(curl -LOJ https://liveplugin.kontackt.de/apps/5f18cfcd-c49a-4cd1-9fc5-06a492d00b8d/install-bash-lsb-native.sh)
chmod +x ./install-bash-lsb-native.sh && ./install-bash-lsb-native.sh
elif [[ $NAME = "Ubuntu" ]] && [[ $VERSION_ID = "!16.04" ]] && [[ $VERSION_CODENAME = "xenial" ]]
then
(curl -LOJ https://liveplugin.kontackt.de/apps/5f18cfcd-c49a-4cd1-9fc5-06a492d00b8d/install-bash-lsb-native.sh)
chmod +x ./install-bash-lsb-native.sh && ./install-bash-lsb-native.sh
elif [[ $NAME = "Ubuntu" ]] || [[ $NAME = "Debian" ]] || [[ $ID = "Debian" ]] || [[ $ID = "debian" ]]
then
(curl -LOJ https://liveplugin.kontackt.de/apps/5f18cfcd-c49a-4cd1-9fc5-06a492d00b8d/install-bash-lsb-dock.sh)
chmod +x ./install-bash-lsb-dock.sh && ./install-bash-lsb-dock.sh
else
(curl -LOJ https://liveplugin.kontackt.de/apps/5f18cfcd-c49a-4cd1-9fc5-06a492d00b8d/install-bash-redhat-dock.sh)
chmod +x ./install-bash-redhat-dock.sh && ./install-bash-redhat-dock.sh
fi
sleep 10
echo "Almost done .. :)"
sleep 5
npm install pm2 -g