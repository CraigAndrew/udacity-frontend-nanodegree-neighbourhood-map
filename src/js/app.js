// Entry Point for application.

// imports
const GoogleMapsApiLoader = require('google-maps-api-loader');

// constant declarations
const defaultLat = -29.83608;
const defaultLng = 30.918399;
const googleApiKey = 'AIzaSyC_77S5Ozh5RMPEQ98QBA9iOSHPQxZM_N8';
const fourSquareClientId = '0FD1PHV1YKMHSMF0T1M1PFIFLWRB12EQAGRDIK5Z2WOJOVNQ';
const fourSquareClientSecret = 'XXASVO0SW14RJKNE0ETMNNATAPQVBO0PPJA5WFNATBPW3J3L';

/**
 * Temporary init map function.
 */
function initMap() {
  var latLng = {lat: defaultLat, lng: defaultLng};
  var map = new google.maps.Map(document.getElementById('map'), {
    center: latLng,
    zoom: 10
  });
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
}

function loadPlacesDataList() {
  const placesArr = [
    'The Pavilion Shopping Center',
    'Westville Mall',
    'Kauai',
    'Olive & Oil Cafe',
    'Waxy O\'Connors',
    'Lupa Osteria',
    'Chez nous'
  ];

  // Loop over the JSON array.
  placesArr.forEach(function (place) {
    // Get the <datalist> and <input> elements.
    var dataList = document.getElementById('data-places');
    var input = document.getElementById('places');

    // Create a new <option> element.
    var option = document.createElement('option');
    // Set the value using the item in the JSON array.
    option.value = place;
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
