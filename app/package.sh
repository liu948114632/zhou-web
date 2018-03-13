#!/bin/bash

# npm install uglify-js  -g

function uglifyjss(){
    for file in `ls $1`
    do
        if [ -d $1"/"$file ]
        then
            uglifyjss $1"/"$file $2"/"$file
        else
            echo "uplify" $1"/"$file "=>" $2"/"$file
            uglifyjs $1"/"$file -m -c -o $2"/"$file
        fi
    done
}

# npm install uglifycss  -g

function uglifycsss(){
    for file in `ls $1`
    do
        if [ -d $1"/"$file ]
        then
            uglifycsss $1"/"$file $2"/"$file
        else
            echo "uplify" $1"/"$file "=>" $2"/"$file
            uglifycss --max-line-len 500 $1"/"$file > $2"/"$file
        fi
    done
}

basepath=$(cd `dirname $0`; pwd)
basepath=${basepath/\/app/''}
#echo $basepath

rm -rf $basepath/html
mkdir -p $basepath/html/dist
cp -rf $basepath/app/* $basepath/html
rm $basepath/html/package.sh
uglifyjss $basepath/app/dist/js $basepath/html/dist/js
uglifycsss $basepath/app/dist/css $basepath/html/dist/css
