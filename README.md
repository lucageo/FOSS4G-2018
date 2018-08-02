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


