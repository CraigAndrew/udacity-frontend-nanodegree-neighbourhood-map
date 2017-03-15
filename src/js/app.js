// Entry Point for application.

// imports
const GoogleMapsApiLoader = require('google-maps-api-loader');

// constant declarations
const defaultLat = -29.83608;
const defaultLng = 30.918399;
const googleApiKey = 'AIzaSyC_77S5Ozh5RMPEQ98QBA9iOSHPQxZM_N8';
const fourSquareClientId = '0FD1PHV1YKMHSMF0T1M1PFIFLWRB12EQAGRDIK5Z2WOJOVNQ';
const fourSquareClientSecret = 'XXASVO0SW14RJKNE0ETMNNATAPQVBO0PPJA5WFNATBPW3J3L';
const places = [
  { name: 'The Pavilion Shopping Center', lat: -29.849002300639423, lng: 30.93577734073859 },
  { name: 'Westville Mall', lat: -29.83608, lng: 30.918399 },
  { name: 'Kauai', lat: -29.83608, lng: 30.918399 },
  { name: 'Olive & Oil Cafe', lat: 29.839529871456172, lng: 30.925247375447384 },
  { name: 'Waxy O\'Connors', lat: -29.827756663602152, lng: 30.929725103495258 },
  { name: 'Lupa Osteria', lat: -29.8277474062012, lng: 30.930414401226106 },
  { name: 'Chez nous', lat: -29.836469892379846, lng: 30.91703684659349 }
];

/**
 * Temporary init map function.
 */
function initMap() {
  var latLng = {lat: defaultLat, lng: defaultLng};
  var map = new google.maps.Map(document.getElementById('map'), {
    center: latLng,
    zoom: 5
  });

  places.forEach(({ lat, lng })=> {
    var marker = new google.maps.Marker({
      position: { lat, lng },
      map: map
    });
  });

}

function loadPlacesDataList() {
  // Loop over the JSON array.
  places.forEach(function ({ name }) {
    // Get the <datalist> and <input> elements.
    var dataList = document.getElementById('data-places');
    var input = document.getElementById('places');

    // Create a new <option> element.
    var option = document.createElement('option');
    // Set the value using the item in the JSON array.
    option.value = name;
    // Add the <option> element to the <datalist>.
    dataList.append(option);
  });
}

GoogleMapsApiLoader({
  libraries: ['places'],
  apiKey: 'AIzaSyC_77S5Ozh5RMPEQ98QBA9iOSHPQxZM_N8'
}).then(function (googleApi) {
  console.log('andrewc');
  initMap();
  var autocomplete = new googleApi.maps.places.AutocompleteService();

  loadPlacesDataList();
  console.log('andrewc dataList', dataList);

  // Update the placeholder text.
  input.placeholder = "e.g. datalist";
}, function (err) {
  console.error(err);
});
