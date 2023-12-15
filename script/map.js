mapboxgl.accessToken =
  'pk.eyJ1IjoiZGFycmVuMzMxMCIsImEiOiJjbG54ZXczN3YwZnFiMmltcXN6dHJmMTBkIn0.qqQ5VL1qikfUzNfFMZprzg';

const usaBounds = [
  [-110, 11], // Southwest coordinates (bottom-left corner)
  [-70, 55], // Northeast coordinates (top-right corner)
];

const mainlandUSBounds = [
  [-135, 20], 
  [-50, 50], 
];

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-70, 34.5],
  zoom: 1,
  maxZoom: 7,
  minZoom: 4,
  // pitch: 40,
});

map.setMaxBounds(mainlandUSBounds);

map.on('click', function (e) {
  const lngLat = e.lngLat;

  map.flyTo({
    center: lngLat,
    zoom: map.getZoom() + 5,
    speed: 2,
    essential: true,
  });
});

map.fitBounds(usaBounds, {
  padding: 20, // Optional padding to leave some space around the bounds
});
map.on('load', function () {
  //Election_by_state (GeoJSON)
  map.addSource('electionData', {
    type: 'geojson',
    data: './Data/election.geojson',
  });
  // console.log(map.getSource('electionData'));

  map.addLayer({
    id: 'electionData-layer',
    type: 'fill',
    source: 'electionData',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'dem_this_margin'],
        -5,
        '#ad2831',
        0,
        '#441179',
        5,
        '#1e88e5',
      ],
      'fill-outline-color': [
        'interpolate',
        ['linear'],
        ['get', 'dem_this_margin'],
        -10,
        '#ad2831',
        0,
        'white',
        10,
        '#1e88e5',
      ],
      'fill-opacity': 0.2,
    },
    layout: {},
  });

  //Banned Books Map (GeoJSON)
  map.addSource('multipolygons', {
    type: 'geojson',
    data: './Data/merged_df.geojson',
  });

  map.addLayer({
    id: 'multipolygons-layer',
    type: 'fill',
    source: 'multipolygons',
    paint: {
      'fill-color': '#f2bb05',
      'fill-opacity': 0.3,
    },
    layout: {},
  });
}); 

//Legend
const legend_election = document.getElementById('legend_election');
const legend_book = document.getElementById('legend_book');

const legendData1 = [
  { label: 'Rep', color: '#ad2831' },
  { label: '-', color: '#731C22' },
  { label: 'Swing', color: '#441179' },
  { label: '-', color: '#0F4B80' },
  { label: 'Dem', color: '#1e88e5' },
];

const legendData2 = [
  { label: '0', color: '#634D03' },
  { label: '-', color: '#785D02' },
  { label: '-', color: '#A27C02' },
  { label: '-', color: '#C89A04' },
  { label: '> 40', color: '#F2BB05' },
];

legendData2.forEach(function (item) {
  let legendItem = document.createElement('div');
  legendItem.className = 'legend-item';

  let legendColor = document.createElement('div');
  legendColor.className = 'legend-color';
  legendColor.style.backgroundColor = item.color;

  let legendLabel = document.createElement('div');
  legendLabel.className = 'legend-label';
  legendLabel.textContent = item.label;

  legendItem.appendChild(legendColor);
  legendItem.appendChild(legendLabel);
  legend_book.appendChild(legendItem);
});

legendData1.forEach(function (item) {
  let legendItem = document.createElement('div');
  legendItem.className = 'legend-item';

  let legendColor = document.createElement('div');
  legendColor.className = 'legend-color';
  legendColor.style.backgroundColor = item.color;

  let legendLabel = document.createElement('div');
  legendLabel.className = 'legend-label';
  legendLabel.textContent = item.label;

  legendItem.appendChild(legendColor);
  legendItem.appendChild(legendLabel);
  legend_election.appendChild(legendItem);
});

//hover menu
let features;
map.on('mousemove', 'multipolygons-layer', function (e) {
  features = map.queryRenderedFeatures(e.point, {
    layers: ['multipolygons-layer'],
  });
  // console.log(features);
  if (features.length > 0) {
    let districtName = features[0].properties.District_x;
    let bookBanningQuantity = features.length;
    // console.log(bookBanningQuantity);

    // console.log(districtName);
    document.getElementById('district-name').innerHTML =
      '<h3>' + districtName + '</h3>';
    '<p>Book Banning Quantity: ' + bookBanningQuantity + '</p>';
  } else {
    document.getElementById('district-name').innerHTML = '';
  }
});

var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

map.on('mouseenter', 'multipolygons-layer', function (e) {
  let districtName = features[0].properties.District_x;
  let bookBanningQuantity = features.length;
  popup
    .setLngLat(e.lngLat)
    .setHTML(
      '<div class="school-popup">' +
        '<h4>' +
        districtName +
        '</h4>' +
        '<br>' +
        '<p>Book Banning Quantity: ' +
        bookBanningQuantity +
        '</p>'
    )
    // .setClassName('school-popup')
    .addTo(map);
});

map.on('mouseleave', 'multipolygons-layer', function () {
  popup.remove();
});


//button for toggling election data
let showElectionData = false;

document.getElementById('toggleButton').addEventListener('click', function () {
  showElectionData = !showElectionData;

  if (showElectionData) {
    map.setLayoutProperty('electionData-layer', 'visibility', 'visible');
  } else {
    map.setLayoutProperty('electionData-layer', 'visibility', 'none');
  }
});

//zoom controls
const zoomInButton = document.getElementById('zoomInButton');
const zoomOutButton = document.getElementById('zoomOutButton');
const resetZoomButton = document.getElementById('resetZoomButton');

zoomInButton.addEventListener('click', function () {
  map.zoomIn();
});

zoomOutButton.addEventListener('click', function () {
  map.zoomOut();
});

resetZoomButton.addEventListener('click', function () {
  map.flyTo({
    center: [-90, 40],
    zoom: 4.5,
    speed: 0.5,
    essential: true,
    // pitch: 0,
  });
});
