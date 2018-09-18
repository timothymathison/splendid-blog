#!/bin/bash

#upload all files in the content folder to the s3 development bucket

s3_bucket=s3://splendidblogdev
cwd=`pwd`

aws s3 cp $cwd/content/ $s3_bucket/ --recursive
