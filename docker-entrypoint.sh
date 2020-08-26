#!/usr/bin/env bash
#
if [ "${DOWNLOAD_DATA}" = "True" ]; then
	

	if [ -f "/data/${GTFS_FILE}" ]; then

		zipfile="/data/${GTFS_FILE}"
		unzipdir=${zipfile%.zip}

		mkdir -p $unzipdir
		#TODO manage multiple gtfs zipfiles

		echo "unzip gtfs file... ${zipfile}"

		unzip -qo -d $unzipdir $zipfile

		node gtfs2bbox/bbox.js $unzipdir

	else
		echo "No such zipped gtfs file /data/${GTFS_FILE}"
	fi
	#
	# TODO use scripts in ./gtfs2bbox after dowloaded gtfs data
	# bbox.js, bboxes.js and fetch-osm-wget.js or 
	# #curl 'https://overpass-api.de/api/map?bbox=10.4233,45.6601,11.9778,46.4908' -o $DIR/trento.OSM

	#TEST POVO little bbox curl 'https://overpass-api.de/api/map?bbox=11.145640,46.058827,11.166111,46.070020' -o ./data/povo.osm

	#TODO check srtm data and download by bbox of gtfs
	##curl http://srtm.csi.cgiar.org/wp-content/uploads/files/srtm_5x5/TIFF/srtm_39_03.zip -L -o /tmp/srtm_39_03.zip
	#unzip -o srtm_39_03.zip -x "*.tfw" "*.hdr" "*.txt" -d $DIR
fi

if [ "${BUILD_GRAPH}" = "True" ]; then
	#TODO check gtfs data

	#TODO use build-config.json
	# https://docs.opentripplanner.org/en/latest/Configuration/

	#BUILD GRAPH
	otp.sh --build /data

	mkdir -p /data/openmove

	if [ -f /data/Graph.obj ]; then
		
		if [ "${BACKUP_GRAPH}" = "True" ]; then
			backfile=$(date +"Graph.obj.%y-%m-%d.tgz")
			echo "Create new backup... $backfile"
			tar -C /data -czf $backfile Graph.obj
		fi

		mv -f /data/Graph.obj /data/openmove/Graph.obj 
	else
		echo "Error to build graph!"
		exit 1
	fi
	#TODO check graph valid,size,bounding box

	exit 0
	#EXIT on graph generated
	#
	#TODO shutdown the machine and log it
fi

if [ ! -f /data/openmove/Graph.obj ]; then
	echo "graph not exists, build a new graph!"
	exit 1
else
	otp.sh --graphs /data --router openmove --server
fi
