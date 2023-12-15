//let books interact with the map markers

document.addEventListener('DOMContentLoaded', function () {
  let geojson;
  let currentMarkers = [];

  // Fetch GeoJSON data
  fetch('Data/merged_df.geojson')
    .then((response) => response.json())
    .then((data) => {
      geojson = data;

      geojson.features.forEach(function (feature) {
        try {
          var originalTitle = feature.properties.Title;
          var cleanedTitle = originalTitle.replace(/[\s\W]/g, '').toLowerCase();
          feature.properties.Title = cleanedTitle;
        } catch (error) {
          console.error(
            'Error processing feature:',
            feature,
            'Error:',
            error.message
          );
        }
      });
    });

  // Handle click on image
  function handleClick(img) {
    let bookTitle = img
      .getAttribute('alt')
      .toLowerCase()
      .replace(/[\s\W]/g, '');
    console.log(bookTitle);

    // Find the features in GeoJSON
    let features = geojson.features.filter(function (feature) {
      try {
        var cleanedTitle = feature.properties.Title;
        return cleanedTitle === bookTitle;
      } catch (error) {
        console.error(
          'Error filtering feature:',
          feature,
          'Error:',
          error.message
        );
        return false; // Skip this feature
      }
    });

    // Check if features are found
    if (features.length > 0) {
      // Clear current markers
      currentMarkers.forEach(function (marker) {
        marker.remove();
      });
      currentMarkers = [];

      // Add markers to the map for each feature
      features.forEach(function (feature) {
        try {
          // Extract coordinates from GeoJSON geometry
          let coordinates = feature.geometry.coordinates[0][0];

          let marker = new mapboxgl.Marker({
            element: createCustomMarkerElement(),
          })

            .setLngLat(coordinates)
            .addTo(map);

          function createCustomMarkerElement() {
            let customMarkerElement = document.createElement('div');
            customMarkerElement.className = 'map-marker'; 
            customMarkerElement.style.backgroundImage =
              'url(png/icon5-removebg-preview.png)';
            customMarkerElement.style.width = '50px'; 
            customMarkerElement.style.height = '50px'; 
            return customMarkerElement;
          }

          // Add marker to the currentMarkers array
          currentMarkers.push(marker);
          // marker.getElement().classList.add('marker-animation');

          // map.easeTo({
          //   // center: coordinates,
          //   zoom: map.getZoom(), // Maintain current zoom level
          //   // pitch: 60, // Set the pitch to create a "downward" view
          //   bearing: 0, // Set the bearing to control the rotation
          //   duration: 1500, // Set the duration of the animation in milliseconds
          // });

          console.log('Marker added for:', bookTitle);
        } catch (error) {
          console.error(
            'Error adding marker for feature:',
            feature,
            'Error:',
            error.message
          );
        }
      });
    } else {
      console.log('No features found for:', bookTitle);
    }
  }

  var imgElements = document.querySelectorAll('.bookTitle');

  imgElements.forEach(function (img) {
    img.addEventListener('click', function () {
      handleClick(img);
    });
  });
});
