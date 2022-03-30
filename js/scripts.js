// mapboxgl access token, used to track my usage of basemaps and other services
mapboxgl.accessToken = 'pk.eyJ1IjoibmFuY3kyMjM1IiwiYSI6ImNremhsenA3dzJibHgyb2t1aHA5ZzJvYXcifQ.ENgwmLpXLnphzFpbbmo-PQ';

// bounds for a citywide view of New York
var nycBounds = [[-74.333496,40.469935], [-73.653717,40.932190]]

$.getJSON('./data/covid-case.geojson', function(covidvac) {

// initialize the map
var map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/light-v10',
  bounds: nycBounds, // sets initial bounds instead of center + zoom
  maxBounds: nycBounds, // sets the max bounds, limited where the user can pan to
  maxZoom: 9.5 // sets the maximum zoom level
});
let hoveredMODZCTAId = null;

map.on('load', () => {
  map.addSource('covidvac', {
    'type': 'geojson',
    'data': './data/covid-case.geojson'
  });

  map.addLayer({
    'id': 'covidvac-fills',
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
  });

  map.addLayer({
    'id': 'covidvac-borders',
    'type': 'line',
    'source': 'states',
    'layout': {},
    'paint': {
        'line-color': '#aa5e79',
        'line-width': 2
      }
    });

  // When moves their mouse over the state-fill layer,update the
  // feature state for the feature under the mouse.
  map.on('mousemove', 'covidvac-fills', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    if (e.features.length > 0) {
      if (hoveredMODZCTAId !== null) {
        map.setFeatureState(
          { source: 'covidvac', id: hoveredMODZCTAId },
          { hover: false }
      );
    }

      hoveredMODZCTAId = e.features[0].id;
      map.setFeatureState(
        { source: 'covidvac', id: hoveredMODZCTAId },
        { hover: true }
      );
    }
  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on('mouseleave', 'covidvac-fills', () => {
    if (hoveredMODZCTAId !== null) {
      map.setFeatureState(
          { source: 'covidvac', id: hoveredMODZCTAId },
          { hover: false }
        );
      }
      hoveredMODZCTAId = null;
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
    });

    map.on('mouseenter', 'covidvac', (e) => {

    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    
    //set up popup content
    var popupContent = `
      <h5>${coverage-by-modzcta-allages_NEIGHBORHOOD_NAME}</h5>
      <p><strong>${coverage-by-modzcta-allages_PERC_FULLY}</strong> residents are fully vaccinated </p>`

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
    });


    // Change the cursor back to a pointer
    // when it leaves the states layer.
    map.on('mouseleave', 'covidvac-fills', () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

  });
})
