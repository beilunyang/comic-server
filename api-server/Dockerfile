FROM daocloud.io/library/node:7.7.4-alpine
MAINTAINER beilunyang <786220806@qq.com>
ENV DIR /wwwroot
RUN mkdir $DIR
WORKDIR $DIR
ADD . $DIR
RUN npm install && npm run build
CMD ['npm', 'serve']
EXPOSE 8888
