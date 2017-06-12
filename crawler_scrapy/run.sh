#!/bin/bash

set -x

crontab ./crontabfile
scrapy crawl comic >> ./comic.log 2>&1 &
tail -F ./new_comic.log