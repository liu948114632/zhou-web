#!/usr/bin/python
# -*- coding: utf-8 -*-
import oss2
import os
import sys

endpoint = 'http://oss-cn-hangzhou.aliyuncs.com'

auth = oss2.Auth('LTAIlJP1N3PTd1iu', 'rsbzBnoMLDDGxPte21McpQZQP5wCuc')
bucket = oss2.Bucket(auth, endpoint, 'kst-exchange')

buildpath = sys.path[0] + "/dist"

for parent,dirnames,filenames in os.walk(buildpath):
    for filename in filenames:
        fullname = os.path.join(parent,filename)
        shortname = "dist" + parent.replace(buildpath, '').replace('\\', '/') + "/" + filename
        print fullname, " ==> ", shortname
        bucket.put_object_from_file(shortname, fullname)