#!/bin/bash

#download the content stored in the development s3 bucket and delete the content in s3 to save storage

s3_bucket=s3://splendidblog
dir=`dirname $0`

aws s3 mv $s3_bucket/ $dir/content/ --recursive --profile splendid-blog
