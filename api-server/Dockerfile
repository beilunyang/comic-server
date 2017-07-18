FROM daocloud.io/library/node:7.7.4-alpine
MAINTAINER beilunyang <786220806@qq.com>
ENV DIR /wwwroot
RUN mkdir $DIR
RUN mkdir /log
WORKDIR $DIR
ADD . $DIR
RUN npm install --production
CMD ["npm", "run", "serve"]
EXPOSE 8888
