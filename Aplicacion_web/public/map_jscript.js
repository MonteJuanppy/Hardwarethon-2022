var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-85.5299, 10.4190]
    }
};

	var map = L.map('map').setView([09.92, -84.07], 8);

	var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

//	var marker = L.marker([10.6297, -85.4379]).addTo(map).bindPopup('<b>Hello world!</b><br />I am a popup.').openPopup();

var myLayer = L.geoJSON().addTo(map);
myLayer.addData(geojsonFeature);

	var polygon = L.polygon([
		[10.06, -84.01],
		[10.18, -84.06],
		[10.10, -84.147]
	]).addTo(map).bindPopup('Zona de Riesgo');

/*
	var circle = L.circle([51.508, -0.11], {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5,
		radius: 500
	}).addTo(map).bindPopup('I am a circle.');


	var popup = L.popup()
		.setLatLng([10.4, -85.5])
		.setContent('Standalone popup.')
		.openOn(map);
*/	
var popup = L.popup();

function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent('Tu has hecho clip en ' + e.latlng.toString())
			.openOn(map);
	console.log(e.latlng)
	}

	map.on('click', onMapClick);


