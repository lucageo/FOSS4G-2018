# Documentation for the workshop 'Free and Open Source Geospatial Tools for Conservation Planning Workshop' FOSS4G 2018 - Dar Es Salaam

##GeoServer setup for enabling Jsonp

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
Save pushing 'ESC'and write:
```
:wq!
```
#Reboot the machine
