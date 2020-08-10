
const turf = require('@turf/turf');

const { Gtfs } = require('@transit/gtfs');

const gtfs = new Gtfs(process.argv[2]);

var points = [];
var bufferInKm = 10;	//TODO as external param

gtfs.forEachStop((stop) => {
  /*if (stop.stop_name === 'Central Station') {
    gtfs.removeStop(stop);
  }*/
  points.push([stop.stop_lon, stop.stop_lat]);
});

var multiPoint = turf.multiPoint(points);

var bboxPoints = turf.bbox(multiPoint);

var bboxPolygon = turf.bboxPolygon(bboxPoints);

var bboxBuffered = turf.buffer(bboxPolygon, bufferInKm, {units: 'kilometers'})

var bbox = turf.bbox(bboxBuffered);

var bboxFlip = [bbox[1],bbox[0], bbox[3],bbox[2]];


console.log({
	stops: points.length,
	buffer: bufferInKm,
	bbox: bboxFlip.toString(),
	bboxfinder: 'http://bboxfinder.com/#'+bboxFlip.toString()
});
