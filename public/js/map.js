mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 12, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl({showCompass: false}));

const marker1 = new mapboxgl.Marker({color: 'rgb(255, 61, 92)'})
.setLngLat(coordinates)
.setPopup(new mapboxgl.Popup({offset: 25,})
.setHTML("<p>Exact location will be provided after booking via email / message.</p>"))
.addTo(map);