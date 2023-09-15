FROM maven:3-jdk-8
#TODO https://github.com/timbru31/docker-java-node

MAINTAINER openmove <info@openmove.com>

ENV BRANCH=v1.5.23 \
    BRANCH_ALIAS=1.5.23 \
    JAVA_MX=2G

RUN mkdir -p /usr/local/share/java


COPY otp.jar /usr/local/share/java/otp.jar
COPY otp /usr/local/bin/

RUN chmod 755 /usr/local/bin/*

EXPOSE 8080
