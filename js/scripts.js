// mapboxgl access token, used to track my usage of basemaps and other services
mapboxgl.accessToken = 'pk.eyJ1IjoibmFuY3kyMjM1IiwiYSI6ImNremhsenA3dzJibHgyb2t1aHA5ZzJvYXcifQ.ENgwmLpXLnphzFpbbmo-PQ';

// bounds for a citywide view of New York
var nycBounds = [[-74.333496,40.469935], [-73.653717,40.932190]]

// initialize the map
var map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/light-v10',
  bounds: nycBounds, // sets initial bounds instead of center + zoom
  maxBounds: nycBounds, // sets the max bounds, limited where the user can pan to
  maxZoom: 9.5 // sets the maximum zoom level
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
