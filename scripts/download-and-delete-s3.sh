#!/bin/bash

#download the content stored in the development s3 bucket and delete the content in s3 to save storage

s3_bucket=s3://splendidblogdev
cwd=`pwd`

aws s3 mv $s3_bucket/ $cwd/content/ --recursive --profile splendid-blog
