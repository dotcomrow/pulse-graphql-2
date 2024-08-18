curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz

tar -xf google-cloud-cli-linux-x86_64.tar.gz

./google-cloud-sdk/install.sh

echo $GOOGLE_CREDENTIALS > service-account.json
./google-cloud-sdk/bin/gcloud auth activate-service-account --key-file=service-account.json


cat `gcloud projects list --format json --filter name="pulsedb-dev" | jq -r '.[0].projectId'` > project_id