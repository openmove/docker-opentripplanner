/*

//example curl 'https://overpass-api.de/api/map?bbox=10.4233,45.6601,11.9778,46.4908 -o $DIR/trento.osm

//https://docs.opentripplanner.org/en/latest/Basic-Tutorial/#osm-for-streets

 */

const fs = require('fs');

const axios = require('axios');

const outdir = './osm';

if(!fs.existsSync(outdir))
    fs.mkdirSync(outdir);

function humanBytes(bytes) {
	if (bytes === 0) return bytes;		
	var sizes = ['Bytes','KB','MB','GB','TB'],
		i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 1) + ' ' + sizes[i];
}

function bbox2url(bbox) {

	//list https://wiki.openstreetmap.org/wiki/Overpass_API
	var ss = [
			'https://overpass-api.de',
			'https://z.overpass-api.de',
			'https://lz4.overpass-api.de',
			'https://overpass.kumi.systems',
			'https://overpass.nchc.org.tw',
			'http://overpass.openstreetmap.fr',
			'http://overpass.osm.ch'
		],
		randHost = ss[Math.floor(Math.random()*ss.length)];

	//return randHost+'/api/map?bbox='+bbox.toString();
	return 'http://localhost/test.txt';
}

function bbox2file(bbox) {
	return outdir+'/'+(bbox.toString().replace(/,/g,'_'))+'.osm';
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

	//console.log(bboxes);
	//(async () => {

			var reqs = bboxes.map(function(b) {

				var url = bbox2url(b);
				var file = bbox2file(b);
				
				return axios.get(url, {responseType: 'stream'}).then(function(response) {
					
					if(fs.existsSync(file))
					    fs.unlinkSync(file);

					console.log('Download...', url, response.statusText);

					var downTot = 0;
					response.data.on('data',function(chunk) {
						downTot = downTot+chunk.length;
    					console.log("Downloading: ", humanBytes(downTot), file);
					});
					response.data.on('end',function(chunk) {
						console.log('Downloaded! ', file);
					});

					response.data.pipe(fs.createWriteStream(file))
				});
			});

			console.log('Promises', reqs)

			Promise.all(reqs).then(function(results) {
				console.log('results',results)
			});
	//})();
});
