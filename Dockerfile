FROM openjdk:8-jre-alpine3.9

MAINTAINER openmove <info@openmove.com>

ENV BRANCH=v1.4.0 \
    BRANCH_ALIAS=1.4.0 \
    JAVA_MX=4G

RUN apk update
RUN apk add bash

RUN mkdir -p /usr/local/share/java

#TODO download and compile java sources

COPY otp.jar /usr/local/share/java/otp.jar
COPY otp.sh /usr/local/bin/

COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod 755 /usr/local/bin/*
RUN chmod 755 /docker-entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/bin/bash"]
CMD ["/docker-entrypoint.sh"]
