mapboxgl.accessToken = 'pk.eyJ1IjoibmFuY3kyMjM1IiwiYSI6ImNremhsenA3dzJibHgyb2t1aHA5ZzJvYXcifQ.ENgwmLpXLnphzFpbbmo-PQ';

var map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-74.997456, 40.730831], // initial map center in [lon, lat]
  zoom: 10
});


map.on('load', () => {
  map.addSource('covidvac', {
    'type': 'geojson',
    'data': './data/covid-case.geojson'
  })

  map.addLayer({
    'id': 'covidvac',
    'type': 'fill',
    'source': 'covidvac',
    'paint': {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'coverage-by-modzcta-allages_PERC_FULLY'],
        0,
        '#f1eef6',
        60,
        '#bdc9e1',
        70,
        '#74a9cf',
        80,
        '#2b8cbe',
        90,
        '#045a8d',
      ]
    }
  })
})
