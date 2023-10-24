#!/bin/bash
ID=$(docker run -d --name kms --network host --restart=always \
    -e KMS_MIN_PORT=49152 \
    -e KMS_MAX_PORT=65535 \
    -v '/:/kms_uploads' \
    -v '/var/kontackt_engine_conf/UriEndpoint.conf.ini:/etc/kurento/modules/kurento/UriEndpoint.conf.ini' \
    -v '/home/admin/conf/web/rougee.io/ssl/:/ssl' \
    -v '/var/kontackt_engine_conf/kurento.conf.json:/etc/kurento/kurento.conf.json' kontackt_engine)
sudo docker attach $ID &
trap 'done=1' TERM INT