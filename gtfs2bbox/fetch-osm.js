/*

//example curl 'https://overpass-api.de/api/map?bbox=10.4233,45.6601,11.9778,46.4908 -o $DIR/trento.osm

//https://docs.opentripplanner.org/en/latest/Basic-Tutorial/#osm-for-streets

 */

//const http = require('http');		//dont support https
const fs = require('fs');

const fetch = require('node-fetch');//https://github.com/node-fetch/node-fetch
const util = require('util');
const streamPipeline = util.promisify(require('stream').pipeline);

const outdir = './osm';

function getUrl(bbox) {
	//list https://wiki.openstreetmap.org/wiki/Overpass_API
	var ss = [
			'https://overpass-api.de',
			'https://z.overpass-api.de',
			'https://lz4.overpass-api.de',
			'https://overpass.kumi.systems',
			'https://overpass.nchc.org.tw',
			'http://overpass.openstreetmap.fr',
			'http://overpass.osm.ch',
		],
		randHost = ss[Math.floor(Math.random()*ss.length)];

	return randHost+'/api/map?bbox='+bbox.toString();
}

if(!fs.existsSync(outdir))
    fs.mkdirSync(outdir);

function downOsmFile(bbox) {
	var url = getUrl(bbox),
		filename = outdir+'/'+(bbox.toString().replace(/,/g,'_'))+'.osm';

	if(fs.existsSync(filename))
	    fs.unlinkSync(filename);

	console.log('Download... ', url);
	const fileout = fs.createWriteStream(filename);	
/*	const request = http.get(url, (resp) => {
		if (resp.statusCode != 200) {
			return;
		}

		resp.pipe(fileout);
	});*/

	const resp = fetch(url);
	streamPipeline(resp.buffer(), fileout);
	//resp.buffer().pipe(fileout);
	//const buffer = resp.buffer();
}

//read json stdin from pipe
var chunks = [];
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (chunk) {
    chunks.push(chunk);
});

process.stdin.on('end', function () {
    var inputJSON = chunks.join(),
        json = JSON.parse(inputJSON),
        bb = json.bboxes;

	const bboxes = [bb[0],bb[1],bb[3]];
	//TODO to subdivide list of parallel downloads

	console.log(bboxes);


	(async () => {
		await Promise.all(bboxes.map(bbox => downOsmFile(bbox)));
	})();
});


