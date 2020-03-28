#!/bin/bash

#upload all files in the content folder to the s3 development bucket

s3_bucket=s3://splendidblog
dir=`dirname $0`

aws s3 cp $dir/content/ $s3_bucket/ --recursive --profile splendid-blog
