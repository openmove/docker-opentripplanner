
# OpenTripPlanner Openmove Docker Services

This project contains a Docker images for stable
[OpenTripPlanner](http://opentripplanner.org) releases.
*docker-compose* is required.


## Scripts

```otp.sh``` a shortcut for command `java -jar otp.jar`

## Build

```
docker build -t openmove/opentripplanner:<otp version> .

docker push openmove/opentripplanner:<otp version>
```

## Usage

Inside a Dockerfile, or docker run in local machine.
The `otp` command is available as a shortcut for `java -jar otp.jar`:

```
    docker run \
        -e JAVA_MX=2G \
        -v $PWD:/data:ro \
        -p 8080:8080 \
        openmove/opentripplanner:1.5.3 \
        otp --build /data --inMemory
```

After the graph has been built, the planner is available at port *8080*.

### Environment variables

**JAVA_MX**: The amount of heap space available to OpenTripPlanner. (The `otp`
             command adds `-Xmx$JAVA_MX` to the `java` command.) Default: 2G

