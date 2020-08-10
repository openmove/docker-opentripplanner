OpenTripPlanner Docker image
============================

This project contains a Docker image for stable
[OpenTripPlanner](http://opentripplanner.org) releases.


```build_graph.sh``` build data graph
```otp.sh``` a shortcut for command `java -jar otp.jar`

## Download data

calculate bounding box with buffer from GTFS directory

```bash
cd gtfs2bbox/
npm install
node index.js ../data/200804_ExportGTFS
```

**output**:
```javascript
{
	stops: 4669,
	buffer: 10,
	bbox:
	'46.01005848495291,10.000282971097848,47.32428314950289,12.86105887382695',
	bboxfinder:
	'http://bboxfinder.com/#46.01005848495291,10.000282971097848,47.32428314950289,12.86105887382695'
}
```

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
