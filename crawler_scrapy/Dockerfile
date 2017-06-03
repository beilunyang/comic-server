FROM daocloud.io/library/python:3.6.1-alpine
MAINTAINER beilunyang <786220806@qq.com>
ENV DIR /wwwroot
RUN mkdir $DIR
WORKDIR $DIR
ADD . $DIR
RUN pip install -r requirements.txt
CMD  ["scrapy", "crawl", "comic"]