mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: loc, // starting position [lng, lat]
    zoom: 12 // starting zoom
});

const marker2 = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(loc)
    .addTo(map);