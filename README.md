# Free and Open Source Geospatial Tools for Conservation Planning Workshop - FOSS4G 2018 - Dar Es Salaam

## Web Gis Application Development
Step by step documentation for developing a small web application that allows users to show, query and interact with geospatial data.

Demo: https://lucageo.github.io/foss4g2web/
_____________________________________________________________________________________

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

Make sure you have a Postgis extension on your DB, if you don't, please run the following commands using pgAdim:
```
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```
Create a new workspace called 'foss4g'

Create a new Store (PostGIS Database type) called 'wdpa_db' with the folloing parameters:

- [x] dbtype: postgis
- [x] host: localhost
- [x] port: 5432
- [x] database: postgis
- [x] schema: public
- [x] user: user
- [x] password: user

and publish the wdpa layer.

- Layer Name: wdpa
- Layer Title: wdpa
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
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
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


### CSS

```
#map {
min-height: 800px;
height: 100%;
padding: 10px;
}
#banner{
background-image: linear-gradient(to bottom right,#ffffff,#ffffff);
padding: 10px;
color: #4a4f51;
box-shadow: 0px -15px 5px 0px rgba(0, 0, 0, 0), 0 3px 6px rgba(0, 0, 0, 0.07);
position: relative;
z-index: 9999;
}
#banner > img{
width: 186px;
float: right;
margin-top: -45px;
margin-right: 14px;
}
#sankey_basic{
position: relative;
z-index: 2147483647;
background: #ffffffe8;
display: none;
padding: 15px;
margin-top: -13px;
border-top: 1px solid #e0e0e0;
box-shadow: 8px -5px 7px 1px rgba(0, 0, 0, 0.03), 0px 2px 0px 0px rgba(255, 255, 255, 0);
}
#wdpa_plot_1995{
position: relative;
z-index: 2147483647;
background: #ffffffe8;
display: none;
padding: 15px;
margin-top: -13px;
border-top: 1px solid #e0e0e0;
box-shadow: 8px -5px 7px 1px rgba(0, 0, 0, 0.03), 0px 2px 0px 0px rgba(255, 255, 255, 0);
}
#wdpa_plot_2015{
position: relative;
z-index: 2147483647;
background: #ffffffe8;
display: none;
padding: 15px;
margin-top: -13px;
border-top: 1px solid #e0e0e0;
box-shadow: 8px -5px 7px 1px rgba(0, 0, 0, 0.03), 0px 2px 0px 0px rgba(255, 255, 255, 0);
}
#wdpa_plot_1995_title{
background-color: #ffffff;
margin-top: -17px;
color: #261a1a;
font-family: unset;
font-size: 14px;
font-weight: 100!important;
display: none;
margin-top: -19px;
border-bottom: 1px solid #ebebeb;
border-top: 1px solid #ebebeb;
}
#wdpa_plot_2015_title{
background-color: #ffffff;
margin-top: -17px;
color: #261a1a;
font-family: unset;
font-size: 14px;
font-weight: 100!important;
display: none;
margin-top: -19px;
border-bottom: 1px solid #ebebeb;
border-top: 1px solid #ebebeb;
}
#sankey_basic_title{
background-color: #ffffff;
margin-top: -17px;
color: #261a1a;
font-family: unset;
font-size: 14px;
font-weight: 100!important;
display: none;
margin-top: -19px;
border-bottom: 1px solid #ebebeb;
border-top: 1px solid #ebebeb;
}
.row {
margin-right: 0px;
margin-left: 0px;
margin-top: -300px;
position: relative;
z-index: 999999;
}
.row1 {
margin-right: 0px;
margin-left: 0px;
margin-top: -320px;
position: relative;
z-index: 9999;
z-index: 99999999;
margin-bottom: 5px;
}
.leaflet-popup-content-wrapper, .leaflet-popup-tip {
background: #fffffff2!important;
color: #516440!important;
}
.leaflet-popup-content-wrapper {
border-radius: 0px!important;
}
```

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

var baseMaps = {"White" : light, "Esri_WorldImagery":Esri_WorldImagery};
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
			'propertyName': 'name,wdpaid',
			'query_layers': 'foss4g:wdpa',
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
var url = 'https://localhost:8082/geoserver/foss4g/wms';
var wdpa_hi=L.tileLayer.wms(url, {
	  layers: 'foss4g:wdpa',
		transparent: true,
		format: 'image/png',
		opacity:'1',
		styles: 'protected_areas_selected',
		zIndex: 44
 }).addTo(map);
wdpa_hi.setParams({CQL_FILTER:"wdpaid LIKE ''"});
```
### Popup configuration  

```
 function hi_highcharts_wdpa(info,latlng){
     var name      = info['name'];
     var wdpaid    = info['wdpaid'];
	var popupContent = '<center><h5>'+name+'</h5></center>';
	var popup = L.popup()
			 .setLatLng([latlng.lat, latlng.lng])
			 .setContent(popupContent)
			 .openOn(map);
 }
```

### Add Charts and Popup

- Land Cover 1995 -2015
```
function hi_highcharts_wdpa(info,latlng){
 var name=info['name'];
 var wdpaid=info['wdpaid'];
 var popupContent = '<center><h5>'+name+'</h5></center>';
 var popup = L.popup()
	.setLatLng([latlng.lat, latlng.lng])
	.setContent(popupContent)
	.openOn(map);
	$( "#wdpa_plot_1995" ).show();
	$( "#wdpa_plot_2015" ).show();
	$( "#wdpa_plot_1995_title" ).show();
	$( "#wdpa_plot_2015_title" ).show();

// Land Cover Change (1995-2015)
var url_wdpaid_lcc = 'http://localhost:8888/rest.py?type=fun&schema=public&obj=get_pa_lc_1995_2015&params=(wdpaid:'+wdpaid+')';
  //console.log(url_wdpaid_lcc);
  $.ajax({
	      url: url_wdpaid_lcc,
	      dataType: 'json',
	      success: function(d) {
  		             var _1995_man;
  		             var _1995_nat;
  		             var _1995_wat;
  		             var _1995_cul;
                             var _2015_man;
  		             var _2015_nat;
  		             var _2015_wat;
  		             var _2015_cul;
                             var name;

                   $(d).each(function(i, data) {
                    _1995_man = parseFloat(data._1995_man);
                    _1995_nat = parseFloat(data._1995_nat);
                    _1995_wat = parseFloat(data._1995_wat);
                    _1995_cul = parseFloat(data._1995_cul);
                    _2015_man = parseFloat(data._2015_man);
                    _2015_nat = parseFloat(data._2015_nat);
                    _2015_wat = parseFloat(data._2015_wat);
                    _2015_cul = parseFloat(data._2015_cul);
                    name = data.name;
                 });
                 
    // Land Cover 1995
     $('#wdpa_plot_1995').highcharts({
    	 chart: {type:'bar', height: 300,
    	 backgroundColor:'rgba(255, 255, 255, 0)',
    	 legend: {enabled: false}
       },
    	 title: {text: null},
    	 subtitle: {text: null},
    	 credits: {
	 enabled: false,
	 text: '© DOPA Services',
	 href: 'http://dopa.jrc.ec.europa.eu/en/services'
    	 },
	xAxis: {
	categories: [name]
    	 },
    	 yAxis: {
	 title: { text: null },
	 labels: {overflow: 'justify'}
    	 },
    	 series:[{
		name: 'Cultivated / managed land',
		color: '#d07a41',
		data: [_1995_cul]
		},{
		name: 'Mosaic natural / managed land',
		color: '#cca533',
		data: [_1995_man]
		},{
		name: 'Natural / semi-natural land',
		color: '#759a5d',
		data: [_1995_nat]
		},{
		name: 'Water / snow and ice',
		color: '#5976ab',
		data: [_1995_wat]
		}]
     });

     // Land Cover 2015
     $('#wdpa_plot_2015').highcharts({
    	 chart: {type:'bar', height: 300,
    	 backgroundColor:'rgba(255, 255, 255, 0)',
    	 legend: {enabled: false}
    	 },
    	 title: {text: null},
    	 subtitle: {text: null},
    	 credits: {
	 enabled: false,
	 text: '© DOPA Services',
	 href: 'http://dopa.jrc.ec.europa.eu/en/services'
    	 },
	xAxis: {
	categories: [name]
	},
    	 yAxis: {
	 title: { text: null },
	 labels: {overflow: 'justify'}
    	 },
       series:[{
	name: 'Cultivated / managed land',
	color: '#d07a41',
	data: [_2015_cul]
	},{
	name: 'Mosaic natural / managed land',
	color: '#cca533',
	data: [_2015_man]
	},{
	name: 'Natural / semi-natural land',
	color: '#759a5d',
	data: [_2015_nat]
	},{
	name: 'Water / snow and ice',
	color: '#5976ab',
	data: [_2015_wat]
	}]
     });

   },
	  
 });

}


```
### Add 2 responsive div to index.html

- in order to render the charts 2 div have to be added next to the div 'map'

```
    <div class="row1">
    <center><div id="wdpa_plot_1995_title" class="col-sm-6"> Land Cover 1995</div></center>
    <center><div id="wdpa_plot_2015_title" class="col-sm-6">Land Cover 2015</div></center>
    </div>
    <div class="row">
    <center><div id="wdpa_plot_1995" class="col-sm-6"></div></center>
    <center><div id="wdpa_plot_2015" class="col-sm-6"></div></center>
    </div>
```

### Hide Charts when the popup is closed

- add this 4 lines to the bottom of the script

```
map.on('popupclose', function (){ 
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

