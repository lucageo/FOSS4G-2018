
//Initialise map
var pixel_ratio = parseInt(window.devicePixelRatio) || 1;

var max_zoom = 16;
var tile_size = 512;

var map = L.map('map', {
}).setView([-7, 38], 6);



var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
 attribution: 'October 2017 version of the World Database on Protected Areas (WDPA)'
});
var light  = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
  subdomains: 'abcd',
  opacity: 1,
  attribution: 'October 2017 version of the World Database on Protected Areas (WDPA)',
  maxZoom: 19
}).addTo(map);
var topLayer =  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png', {
  subdomains: 'abcd',
  opacity: 1,
  maxZoom: 19
}).addTo(map);



// /rofs/usr/local/lib/geoserver-2.10.4/webapps/geoserver/WEB-INF


// on click function
map.on('click', function(e) {
	 if (map.hasLayer(wdpa_tanzania)) {
		var latlng= e.latlng;
		var url = getFeatureInfoUrl(
										map,
										wdpa_tanzania,
										e.latlng,
										{
												'info_format': 'text/javascript',  
												'propertyName': ' name,wdpaid,rep_area',
												'query_layers': 'cite:wdpa_tanzania',
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
						 if (typeof data.features[0]!=='undefined')
								 {
										var prop=data.features[0].properties;
										var filter="wdpaid='"+prop['wdpaid']+"'";
										wdpa_hi.setParams({CQL_FILTER:filter});
										hi_highcharts_wdpa(prop,latlng);
							}
							else {}
						}
				 }
				 else {
			 }
});

// wdpa layer
var url = 'http://localhost:8082/geoserver/cite/wms';
var wdpa_tanzania=L.tileLayer.wms(url, {
		layers: 'cite:wdpa_tanzania',
		transparent: true,
		format: 'image/png',
		opacity:'1',
		zIndex: 33
	}).addTo(map);


	// get feature info function
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

// wdpa HIGLIGHTED
	var url = 'http://localhost:8082/geoserver/cite/wms';
	var wdpa_hi=L.tileLayer.wms(url, {
		  layers: 'cite:wdpa_tanzania',
			transparent: true,
			format: 'image/png',
			opacity:'1',
			styles: 'protected_areas_selected',
			zIndex: 44
	 }).addTo(map);
wdpa_hi.setParams({CQL_FILTER:"wdpaid LIKE ''"});

	 function hi_highcharts_wdpa(info,latlng){
		 var name=info['name'];
		 var wdpaid=info['wdpaid'];
		 var rep_area=info['rep_area'];


			var popupContent = '<center><p>'+name+'</p></center>';
			var popup = L.popup()
					 .setLatLng([latlng.lat, latlng.lng])
					 .setContent(popupContent)
					 .openOn(map);
				$( "#wdpa_plot_1995" ).show();
				$( "#wdpa_plot_2015" ).show();

		 $('#wdpa_plot_1995').highcharts({
			 chart: {type:'column', height: 300,
			 backgroundColor:'rgba(255, 255, 255, 0)',
			 legend: {
					 enabled: false
			 }
		 },
			 colors: ['#0e4664', '#ee6305', '#11640e', '#eecd05'],
			 title: {text: null},
			 subtitle: {
					 text: 'Land Cover 1995'
			 },
			 credits: {
					 enabled: false,
					 text: '© DOPA Services',
					 href: 'http://dopa.jrc.ec.europa.eu/en/services'
			 },
				xAxis: {
							 type: 'category',
							 title: {
									 text: null
							 }
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

		 		 $('#wdpa_plot_2015').highcharts({
		 			 chart: {type:'column', height: 300,
		 			 backgroundColor:'rgba(255, 255, 255, 0)',
		 			 legend: {
		 					 enabled: false
		 			 }
		 		 },
		 			 colors: ['#0e4664'],
		 			 title: {text: null},
		 			 subtitle: {
		 					 text: 'Land Cover 2015'
		 			 },
		 			 credits: {
		 					 enabled: false,
		 					 text: '© DOPA Services',
		 					 href: 'http://dopa.jrc.ec.europa.eu/en/services'
		 			 },
		 				xAxis: {
		 							 type: 'category',
		 							 title: {
		 									 text: null
		 							 }
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

		 			 series: [{
		 								 name: 'Land Cover Classes',
		 								 data: [
		 									     ['Cultivated / managed land', parseFloat(Math.round(rep_area*100)/100)],
		 											 ['Mosaic natural / managed land', parseFloat(Math.round(rep_area*100)/100)],
		 											 ['Natural / semi-natural land', parseFloat(Math.round(rep_area*100)/100)],
		 											 ['Water / snow and ice', parseFloat(Math.round(rep_area*100)/100)]
		 										   ],
		 											 negativeColor: '#efaa17'

		 							 }]




		 		 });

	 } //end of function hi_highcharts_pa

map.on('popupclose', function (){ //map is the name of map you gave to your leaflet map
	$( "#wdpa_plot_1995" ).hide();
	$( "#wdpa_plot_2015" ).hide();
});






//Available Layers
var baseMaps = {"White" : light, "Esri_WorldImagery":Esri_WorldImagery};
var overlayMaps = {'wdpa': wdpa_tanzania};

//Add Layer Control
layerControl = L.control.layers(baseMaps, overlayMaps, null,  {position: 'bottomleft'}).addTo(map);
