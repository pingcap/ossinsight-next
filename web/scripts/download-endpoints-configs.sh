#!/usr/bin/env bash

ENDPOINT_BASEDIR="../configs/endpoints/"

# Download endpoints config from pingcap/ossinsight repo.
rm -rf ./ossinsight-main.zip
curl -LJO https://github.com/pingcap/ossinsight/archive/refs/heads/main.zip;
mkdir ./temp
unzip -o ossinsight-main.zip 'ossinsight-main/configs/queries/orgs/*' -d ./temp

# Move the configs to the /configs/endpoints folder.

rm -rf $ENDPOINT_BASEDIR
mkdir $ENDPOINT_BASEDIR
mv temp/ossinsight-main/configs/queries/orgs $ENDPOINT_BASEDIR/orgs

# Remove the temp folder.
rm -rf ./temp
rm -rf ossinsight-main.zip