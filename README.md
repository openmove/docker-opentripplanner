OpenTripPlanner Docker image
============================

This project contains a Docker image for stable
[OpenTripPlanner](http://opentripplanner.org) releases.


```build_graph.sh``` build data graph
```otp.sh``` a shortcut for command `java -jar otp.jar`

## First build Graph and Cache

```bash
docker run \
	-e JAVA_MX=10G \
	-v $PWD:/data \
	-p 8080:8080 \
	openmove/opentripplanner:1.4.1 \
	otp.sh --build /data --inMemory
```

## Execute OTP instance

```bash
docker run \
	-e JAVA_MX=10G \
	-v $PWD:/data \
	-p 8080:8080 \
	openmove/opentripplanner:1.4.1 \
	otp.sh --graphs /data --router openmove --server
```

After the graph has been built, the planner is available at port *8080*.

### Environment variables

**JAVA_MX**: The amount of heap space available to OpenTripPlanner. (The `otp`
             command adds `-Xmx$JAVA_MX` to the `java` command.) Default: 4G

### Docker Compose

In addition the file `docker-compose.yml` contains a basic configuration 
to running multi-container Docker applications.

require *docker-compose* installed in the system.

```bash
docker-compose up -d 
```
