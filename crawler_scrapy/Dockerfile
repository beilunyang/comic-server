FROM daocloud.io/library/python:3.6.1
MAINTAINER beilunyang <786220806@qq.com>
ENV DIR /wwwroot
RUN apt-get update && apt-get install -y cron
RUN mkdir $DIR
WORKDIR $DIR
ADD . $DIR
RUN touch new_comic.log
RUN touch comic.log
RUN pip install -r requirements.txt
CMD ["./run.sh"]