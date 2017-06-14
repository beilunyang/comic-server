#!/bin/bash

set -x

service cron start
crontab ./crontabfile
scrapy crawl comic >> ./comic.log 2>&1 &
tail -F ./new_comic.log