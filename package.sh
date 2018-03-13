#!/bin/bash
basepath=$(cd `dirname $0`; pwd)
cd $basepath
git pull
cd app
oldVersion=$(cat package.json | grep version | awk -F'"' '{print $4}')
version=$(cat package.json | grep version | awk -F'"' '{print $4+0.01}')
#sed -i "s/$oldVersion/$version/g" package.json
echo $version
rm -rf build
export NODE_ENV=production
webpack -p
gulp package
