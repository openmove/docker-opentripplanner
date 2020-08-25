
const fs = require('fs');

const turf = require('@turf/turf');

const { Gtfs } = require('@transit/gtfs');

const gtfs = new Gtfs(process.argv[2]);

var points = [];
var pp = [];

const bufferInKm = 10;	//TODO as external param
const prec = 6;
const gridSize = process.argv[3] || 15;


function bboxFlip(bb) {
	return [bb[1],bb[0], bb[3],bb[2]];
}

function writeGeo(file, j) {
	return fs.writeFile(file, JSON.stringify(j), ()=>{});
}

gtfs.forEachStop((stop) => {
  points.push([turf.round(stop.stop_lon,prec), turf.round(stop.stop_lat,prec)]);
});

var multiPoint = turf.multiPoint(points);

//DEBUG writeGeo('multiPoint.geojson', multiPoint);
/* SIMPLE ONE BBOX
var bboxPoints = turf.bbox(multiPoint);

var bboxPolygon = turf.bboxPolygon(bboxPoints);

var bboxBuff = turf.buffer(bboxPolygon, bufferInKm, {units: 'kilometers'})

var bbox = turf.bbox(bboxBuff);

var bboxFlip = bboxFlip(bbox);
*/

/* MULTIPLE SUB BBOXES */
var convex = turf.convex(multiPoint, {maxEdge:1, units:'kilometers'});
//TODO var convexSimply = turf.simplify(convexBuff, {tolerance: 0.01, highQuality: false});
var convexBuff = turf.buffer(convex, bufferInKm, {units:'kilometers'})

var convexBbox = turf.bbox(convexBuff);

//15km of tasselation bboxes
var squareGrid = turf.squareGrid(convexBbox, gridSize, {mask: convexBuff, units: 'kilometers'});

writeGeo('grid'+gridSize+'.geojson', squareGrid);

//console.log(JSON.stringify(squareGrid))

var bboxes = squareGrid.features.map((f)=> {
	return turf.bbox(f);
	//return bboxFlip(turf.bbox(f));
});

var out = {
	stops: points.length,
	buffer: bufferInKm,
	bboxes: bboxes,
	overpass: bboxes.map((b)=> {
		return 'https://overpass-api.de/api/map?bbox='+(bboxFlip(b)).toString();
	})
}

console.log(JSON.stringify(out));

/*
console.log('https://overpass-api.de/api/map?bbox='+bboxes[0].toString())
console.log('https://overpass-api.de/api/map?bbox='+bboxes[1].toString())*/