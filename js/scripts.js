mapboxgl.accessToken = 'pk.eyJ1IjoibmFuY3kyMjM1IiwiYSI6ImNremhsenA3dzJibHgyb2t1aHA5ZzJvYXcifQ.ENgwmLpXLnphzFpbbmo-PQ';

var map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-74.0060, 40.7128], // initial map center in [lon, lat]
  zoom: 9.7
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
        '#3bb3c3',
        60,
        '#669ec4',
        70,
        '#8b88b6',
        80,
        '#a2719b',
        90,
        '#aa5e79',
      ]
    }
  })
})
