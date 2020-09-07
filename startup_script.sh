#!/bin/bash
sudo zpool import -a
DATA_CID=$(curl "http://metadata/computeMetadata/v1/instance/attributes/DATA_CID" -H "Metadata-Flavor: Google")
DATA_UUID=$(curl "http://metadata/computeMetadata/v1/instance/attributes/DATA_UUID" -H "Metadata-Flavor: Google")
JOB_CID=$(curl "http://metadata/computeMetadata/v1/instance/attributes/JOB_CID" -H "Metadata-Flavor: Google")
JOB_UUID=$(curl "http://metadata/computeMetadata/v1/instance/attributes/JOB_UUID" -H "Metadata-Flavor: Google")
IPFS_ID=$(docker run -d \
-v /ipfs:/data/ipfs \
--net host \
874224543408.dkr.ecr.us-east-2.amazonaws.com/dev/rig/ipfs:client)

sleep 5

echo "IPFS_ID=$IPFS_ID"
echo "$DATA_CID"
echo "$DATA_UUID"
echo "$JOB_CID"
echo "DATA_CID=$DATA_CID"
docker exec ${IPFS_ID} ipfs cat ${DATA_CID} | sudo zfs receive "gcp/ROOT/data/dataset/${DATA_UUID}"
docker exec ${IPFS_ID} ipfs cat ${JOB_CID} | sudo zfs receive "gcp/ROOT/data/job/${JOB_UUID}"
sudo zpool export -a
