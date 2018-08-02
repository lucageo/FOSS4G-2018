# Free and Open Source Geospatial Tools for Conservation Planning Workshop - FOSS4G 2018 - Dar Es Salaam

## Web Gis Application Development
Step by step documentation for developing a small web application that allows users to show, query and interact with geospatial data.

### GeoServer setup for enabling Jsonp

Go to:
```
cd /usr/local/lib/geoserver-2.10.4/webapps/geoserver/WEB-INF
```
Open with VIM the following file:
```
sudo vim web.xml
```
Uncomment the following lines:
```
<context-param>
    <param-name>ENABLE_JSONP</param-name>
    <param-value>true</param-value>
</context-param>
```
Save pushing 'ESC' and write:
```
:wq!
```
- [x] Reboot the machine

### GeoServer styles
Set up two styles:

1) protected_areas - [xml](https://github.com/lucageo/foss4g/blob/master/wdpa_style.xml) (Terrestrial Marine and Costal PAs)

2) protected_areas_selected - [xml](https://github.com/lucageo/foss4g/blob/master/wdpa_select.xml) (White Line)

### Connect Postgis with GeoServer

Make sure you have a Postgis extension on youy DB, if you dont run the following commands using pgAdim:
```
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```
Create a new Store (PostGIS Database type) called 'wdpa_db' with the folloing parameters:

- [x] dbtype: postgis
- [x] host: localhost
- [x] port: 5432
- [x] database: postgis
- [x] schema: public
- [x] user: user
- [x] password: user

and publish the WDPA layer.

- Layer Name: wdpa_tanzania
- Layer Title: wdpa_tanzania
- Native SRS: 4326
- Declared SRS: 4326

- Apply the style [protected_areas](https://github.com/lucageo/foss4g/blob/master/wdpa_style.xml)

And Save.

### index.html
Create index.html file importing all the libraries and creating a the div "map"
```
<!DOCTYPE HTML>
<html>
  <head>
	<meta charset="utf-8" />
    <title>FOSS4G DAR ES SALAM - CONSERVATION TOOLS</title>
	<link rel="stylesheet" href="leaflet.css" />
	<script src="libraries/leaflet-src.js"></script>
    <script src="libraries/proj4.js"></script>
    <script src="libraries/proj4leaflet.js"></script>
    <script src="libraries/jquery.js"></script>
    <script src="libraries/highcharts.js"></script>
    <script src="libraries/highcharts_more.js"></script>
	<link rel="stylesheet" href="leaflet-example.css" />
	</head>
	<body>
	<div id= 'banner'>
    <center><h1>Free and Open Source Geospatial Tools for Conservation Planning Workshop</h1></center>
    <hr>
	<center><p> Example of a web application using the data produced, integrating various technologies including Postgres, GeoServer, LeafletJs and custom Javascripts.</p></center>
    </div>
	<div id="map"></div>
	<script src="wdpa_stats.js"></script>
	</body>
</html>
```
*In case of troubles, please copy this [file](https://github.com/lucageo/foss4g/blob/master/docs/steps/1/index.html)*

### wdpa_stats.js
Create wdpa_stats.js file and add the folloing lines:

- Initialise map
```
var pixel_ratio = parseInt(window.devicePixelRatio) || 1;
var max_zoom = 16;
var tile_size = 512;
var map = L.map('map', {
}).setView([-7, 38], 6);
```

- Add the 2 basemaps  
```
var WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
 attribution: ''
});
var light  = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
  subdomains: 'abcd',
  opacity: 1,
  attribution: '',
  maxZoom: 19
}).addTo(map);
```

- declare the available layers
```
var baseMaps = {"White" : light, "WorldImagery":WorldImagery};
var overlayMaps = {};
```

- Add Layer Control
```
layerControl = L.control.layers(baseMaps, overlayMaps, null,  {position: 'bottomleft'}).addTo(map);
```
*In case of troubles, please copy this [file](https://github.com/lucageo/foss4g/blob/master/docs/steps/1/wdpa_stats.js)*

### Add the WDPA layer to wdpa_stats.js

- Layer connection to geoserver WMS using tileLayer library 
```
var url = 'https://localhost:8082/geoserver/foss4g/wms';
var wdpa = L.tileLayer.wms(url, {
		layers: 'foss4g:wdpa',
		transparent: true,
		format: 'image/png',
		opacity:'1',
		zIndex: 33
	}).addTo(map);

```

- Add the new layer to the available layers
```
var overlayMaps = {'wdpa': wdpa};

```

### Add on click interaction with the layer to wdpa_stats.js

```
map.on('click', function(e) {
	 if (map.hasLayer(wdpa)) {
		var latlng= e.latlng;
		var url = getFeatureInfoUrl(
				map,
				wdpa,
				e.latlng,
			{
			'info_format': 'text/javascript',  //it allows us to get a jsonp
			'propertyName': ' wdpa_name,wdpaid,rep_area',
			'query_layers': 'dopa_explorer_2:wdpa_foss4g',
			'format_options':'callback:getJson'
			}
			);
	 $.ajax({
		 jsonp: false,
		 url: url,
		 dataType: 'jsonp',
		 jsonpCallback: 'getJson',
		 success: handleJson_featureRequest
		 });
		function handleJson_featureRequest(data)
		{
			if (typeof data.features[0]!=='undefined'){
				var prop=data.features[0].properties;
				var filter="wdpaid='"+prop['wdpaid']+"'";
				wdpa_hi.setParams({CQL_FILTER:filter});
				hi_highcharts_wdpa(prop,latlng);
			}
			else {}
		}
	}
        else {}
});
```

### Add Get Feature Info function to wdpa_stats.js
```
	function getFeatureInfoUrl(map, layer, latlng, params) {

	    var point = map.latLngToContainerPoint(latlng, map.getZoom()),
	        size = map.getSize(),
	        bounds = map.getBounds(),
	        sw = bounds.getSouthWest(),
	        ne = bounds.getNorthEast();

	    var defaultParams = {
	        request: 'GetFeatureInfo',
	        service: 'WMS',
	        srs: 'EPSG:4326',
	        styles: '',
	        version: layer._wmsVersion,
	        format: layer.options.format,
	        bbox: bounds.toBBoxString(),
	        height: size.y,
	        width: size.x,
	        layers: layer.options.layers,
	        info_format: 'text/javascript'
	    };

	    params = L.Util.extend(defaultParams, params || {});
	    params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
	    params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;
	    return layer._url + L.Util.getParamString(params, layer._url, true);
	}

```

### Add WDPA selection layer to wdpa_stats.js and set a CQL filter

```
	var url = 'https://lrm-maps.jrc.ec.europa.eu/geoserver/dopa_explorer_2/wms';
	var wdpa_hi=L.tileLayer.wms(url, {
		  layers: 'dopa_explorer_2:wdpa_foss4g',
			transparent: true,
			format: 'image/png',
			opacity:'1',
			styles: 'polygon',
			zIndex: 44
	 }).addTo(map);
wdpa_hi.setParams({CQL_FILTER:"wdpaid LIKE ''"});
```
### Popup configuration  

```
 function hi_highcharts_wdpa(info,latlng){
	var wdpa_name=info['wdpa_name'];
	var wdpaid=info['wdpaid'];
	var rep_area=info['rep_area'];
	var popupContent = '<center><h5>'+wdpa_name+'</h5></center>';
	var popup = L.popup()
			 .setLatLng([latlng.lat, latlng.lng])
			 .setContent(popupContent)
			 .openOn(map);
 }
```

### Add Charts 

- Land Cover 1995
```
$('#wdpa_plot_1995').highcharts({
	chart: {type:'column', height: 300,
	backgroundColor:'rgba(255, 255, 255, 0)',
	legend: {enabled: false}
	},
	colors: ['#0e4664', '#ee6305', '#11640e', '#eecd05'],
	title: {text: null},
	subtitle: {text: 'Land Cover 1995'},
	credits: {
		enabled: false,
		text: '',
		href: ''
	},
	xAxis: {
	type: 'category',
	title: {text: null}
	},
	yAxis: {
		title: {
			text: '',
			align: 'high'
		},
		labels: {
		overflow: 'justify'
		}

	},
	series:[{
	name: 'Cultivated / managed land',
	color: '#eecd05',
	data: [rep_area ]
	},
	{
	name: 'Mosaic natural / managed land',
	color: '#ee6305',
	data: [rep_area ]
	},
	{
	name: 'Natural / semi-natural land',
	color: '#11640e',
	data: [rep_area ]
	},{
	name: 'Water / snow and ice',
	color: '#0e4664',
	data: [rep_area ]
	}
	]
});

```

- Land Cover 2015
```
$('#wdpa_plot_2015').highcharts({
	chart: {type:'column', height: 300,
	backgroundColor:'rgba(255, 255, 255, 0)',
	legend: {enabled: false}
	},
	colors: ['#0e4664', '#ee6305', '#11640e', '#eecd05'],
	title: {text: null},
	subtitle: {text: 'Land Cover 2015'},
	credits: {
		enabled: false,
		text: '',
		href: ''
	},
	xAxis: {
	type: 'category',
	title: {text: null}
	},
	yAxis: {
		title: {
			text: '',
			align: 'high'
		},
		labels: {
		overflow: 'justify'
		}

	},
	series:[{
	name: 'Cultivated / managed land',
	color: '#eecd05',
	data: [rep_area ]
	},
	{
	name: 'Mosaic natural / managed land',
	color: '#ee6305',
	data: [rep_area ]
	},
	{
	name: 'Natural / semi-natural land',
	color: '#11640e',
	data: [rep_area ]
	},{
	name: 'Water / snow and ice',
	color: '#0e4664',
	data: [rep_area ]
	}
	]
});

```
### Hide Charts when the popup is closed

- add this 4 lines to the bottom of the script

```
map.on('popupclose', function (){ //map is the name of map you gave to your leaflet map
	$( "#wdpa_plot_1995" ).hide();
	$( "#wdpa_plot_2015" ).hide();
});
```

### Hide Charts when the popup is closed

- add this 2 lines to script, after 'hi_highcharts_wdpa' function

```
$( "#wdpa_plot_1995" ).show();
$( "#wdpa_plot_2015" ).show();
```
