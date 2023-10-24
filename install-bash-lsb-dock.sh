#!/bin/bash
wget https://liveplugin.kontackt.de/docker.sh &&  chmod +x ./docker.sh && ./docker.sh
systemctl unmask docker.service
systemctl unmask docker.socket
systemctl enable docker.service
systemctl start docker.service
sudo ufw allow 19302/tcp
sudo ufw allow 19302/udp

sudo ufw allow 40010/tcp
sudo ufw allow 40010/udp

sudo ufw allow 40009/tcp
sudo ufw allow 40009/udp

sudo ufw allow 4002/tcp
sudo ufw allow 4002/udp

sudo ufw allow 1935/tcp
sudo ufw allow 1935/udp

sudo ufw allow 4843/tcp
sudo ufw allow 4843/udp

sudo ufw allow 8000/tcp
sudo ufw allow 8000/udp

sudo ufw allow 9443/tcp
sudo ufw allow 9443/udp

sudo ufw allow 19351/tcp
sudo ufw allow 19351/udp

sudo ufw allow 19352/tcp
sudo ufw allow 19352/udp

docker pull kurento/kurento-media-server:6.18.0 &&
docker tag kurento/kurento-media-server:6.18.0 kontackt_engine &&
#docker rmi $(docker images | grep 'kurento/kurento-media-server');
rm -rf /var/kontackt_engine_conf;
sleep 5
mkdir /var/kontackt_engine_conf
chmod 755 -R /var/kontackt_engine_conf
ls /var/kontackt_engine_conf
wget https://liveplugin.kontackt.de/apps/5f18cfcd-c49a-4cd1-9fc5-06a492d00b8d/kurento.conf.json -P /var/kontackt_engine_conf
wget https://liveplugin.kontackt.de/apps/5f18cfcd-c49a-4cd1-9fc5-06a492d00b8d/UriEndpoint.conf.ini -P /var/kontackt_engine_conf
(curl -LOJ https://liveplugin.kontackt.de/apps/5f18cfcd-c49a-4cd1-9fc5-06a492d00b8d/docker-run.sh)
chmod +x ./docker-run.sh && ./docker-run.sh &&
sleep 30
kontackt_container_id=$(docker ps -l -q) &&
docker commit $kontackt_container_id kontackt_engine &&
docker stop $kontackt_container_id &&
docker start $kontackt_container_id &&
docker container rename $kontackt_container_id kurento_engine &&
sleep 5
docker pull tiangolo/nginx-rtmp &&
docker tag tiangolo/nginx-rtmp vy_nginx_rtmp &&
rm -rf /var/kontackt_engine_conf_nginx_rtmp;
sleep 5
mkdir /var/kontackt_engine_conf_nginx_rtmp
chmod 755 -R /var/kontackt_engine_conf_nginx_rtmp
ls /var/kontackt_engine_conf_nginx_rtmp
wget https://liveplugin.kontackt.de/apps/5f18cfcd-c49a-4cd1-9fc5-06a492d00b8d/nginx.conf -P /var/kontackt_engine_conf_nginx_rtmp
#(curl -LOJ https://liveplugin.kontackt.de/apps/5f18cfcd-c49a-4cd1-9fc5-06a492d00b8d/docker-run-nginx-rtmp.sh)
#chmod +x ./docker-run-nginx-rtmp.sh && ./docker-run-nginx-rtmp.sh &&
DOCKER_NGINX_RTMP_ID=$(docker run -d --name tiangolo-nginx-rtmp --network host --restart=always\
    -v '/home/admin/conf/web/rougee.io/ssl/rougee.io.pem:/ssl/crt' \
    -v '/home/admin/conf/web/rougee.io/ssl/rougee.io.key:/ssl/key' \
    -v '/var/kontackt_engine_conf_nginx_rtmp/nginx.conf:/etc/nginx/nginx.conf' vy_nginx_rtmp)
sleep 30
sudo docker attach $DOCKER_NGINX_RTMP_ID &
trap 'done=1' TERM INT
sleep 10
#kontackt_container_nginx_rtmp_id=$(docker container ls --all --quiet --filter "name=^nginx-rtmp$") &&
#docker commit $kontackt_container_nginx_rtmp_id kontackt_engine_nginx_rtmp &&
#docker stop $kontackt_container_nginx_rtmp_id &&
#docker start $kontackt_container_nginx_rtmp_id &&
#docker container rename $kontackt_container_nginx_rtmp_id kontackt_engine_nginx_rtmp