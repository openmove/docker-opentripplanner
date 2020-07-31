FROM maven:3-jdk-8

MAINTAINER openmove <info@openmove.com>

ENV BRANCH=v1.4.0 \
    BRANCH_ALIAS=1.4.0 \
    JAVA_MX=4G

RUN mkdir -p /usr/local/share/java

COPY otp.jar /usr/local/share/java/otp.jar
COPY otp /usr/local/bin/

RUN chmod 755 /usr/local/bin/*

EXPOSE 8080

#TODO CMD ["/usr/local/bin/otp --graphs /data --router openmove --server"]
