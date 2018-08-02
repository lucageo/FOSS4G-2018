# Free and Open Source Geospatial Tools for Conservation Planning Workshop - FOSS4G 2018 - Dar Es Salaam

## Web Gis Application Development
Step by step documentation for developing a small web application that allows users to show, query and interact with geospatial data.

### 1) GeoServer setup for enabling Jsonp

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
#Reboot the machine

### 1) GeoServer styles
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
```

- Add Layer Control
```
layerControl = L.control.layers(baseMaps, overlayMaps, null,  {position: 'bottomleft'}).addTo(map);
```
*In case of troubles, please copy this [file](https://github.com/lucageo/foss4g/blob/master/docs/steps/1/wdpa_stats.js)*
