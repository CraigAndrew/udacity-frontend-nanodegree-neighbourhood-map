// Entry Point for application.

// imports
const GoogleMapsApiLoader = require('google-maps-api-loader');
const _ = require('lodash');
const $ = require('jquery');

// constant declarations
var fourSquareClientId = '0FD1PHV1YKMHSMF0T1M1PFIFLWRB12EQAGRDIK5Z2WOJOVNQ';
var fourSquareClientSecret = 'XXASVO0SW14RJKNE0ETMNNATAPQVBO0PPJA5WFNATBPW3J3L';
const defaultLat = -29.83608;
const defaultLng = 30.918399;
const googleApiKey = 'AIzaSyC_77S5Ozh5RMPEQ98QBA9iOSHPQxZM_N8';
const places = [
  { name: 'The Pavilion Shopping Center', lat: -29.849002300639423, lng: 30.93577734073859 },
  { name: 'Westville Mall', lat: -29.83608, lng: 30.918399 },
  { name: 'Kauai', lat: -29.83608, lng: 30.918399 },
  { name: 'Olive & Oil Cafe', lat: 29.839529871456172, lng: 30.925247375447384 },
  { name: 'Waxy O\'Connors', lat: -29.827756663602152, lng: 30.929725103495258 },
  { name: 'Lupa Osteria', lat: -29.8277474062012, lng: 30.930414401226106 },
  { name: 'Chez nous', lat: -29.836469892379846, lng: 30.91703684659349 }
];
const defaultZoomLevel = 15;
let map;

/**
 * Temporary init map function.
 */
function initMap() {
  var latLng = {lat: defaultLat, lng: defaultLng};
  map = new google.maps.Map(document.getElementById('map'), {
    center: latLng,
    zoom: defaultZoomLevel
  });

  places.forEach(({ lat, lng })=> {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map
    });
  });
}

function loadPlacesDataList() {
  // Get the <datalist> and <input> elements.
  var dataList = document.getElementById('data-places');
  var input = document.getElementById('places');

  // Loop over the JSON array.
  places.forEach(function ({ name }) {
    // Create a new <option> element.
    var option = document.createElement('option');
    // Set the value using the item in the JSON array.
    option.value = name;

    // Add the <option> element to the <datalist>.
    dataList.append(option);
  });

  input.addEventListener('input', function(e) {
    const place = _.find(places, { 'name': e.target.value });
    if (place) {
      moveToMarker(place);
    }
  });
}

function moveToMarker(place) {
  map.panTo( new google.maps.LatLng( place.lat, place.lng ) );
  const marker = new google.maps.Marker({
    position: {
      lat: place.lat,
      lng: place.lng
    },
    map
  });

  const fourSquareDetails = getFourSquareDetails(marker, place);
}

/**
 * Gets details via Four Square API
 */
function getFourSquareDetails(marker, place) {
  var url = `https://api.foursquare.com/v2/venues/search?client_id=${fourSquareClientId}&client_secret=${fourSquareClientSecret}&v=20130815&ll=
    ${place.lat},${place.lng}&query=\'${place.name}\'&limit=1`;

  const getFourSquareDetailsForPlacePromise = new Promise((resolve, reject) => {
    $.getJSON(url).done(function(response) {
      console.log('response', response);
      resolve(formatFourSquareDetailsForPlaceMarkerDisplay(response));
    });
  });

  function formatFourSquareDetailsForPlaceMarkerDisplay(response) {
    let fourSquareStr = '<p>Foursquare info:<br>';
    var venue = response.response.venues[0];
    var venueId = venue.id;
    var venueName = venue.name;

    if (venueName !== null && venueName !== undefined) {
      fourSquareStr = fourSquareStr + 'name: ' + venueName + '<br>';
    }

    var phoneNum = venue.contact.formattedPhone;
    if (phoneNum !== null && phoneNum !== undefined) {
      fourSquareStr = fourSquareStr + 'phone: ' + phoneNum + '<br>';
    }

    var twitterId = venue.contact.twitter;
    if (twitterId !== null && twitterId !== undefined) {
      fourSquareStr = fourSquareStr + 'twitter name: ' +
          twitterId + '<br>';
    }

    var address = venue.location.formattedAddress;
    if (address !== null && address !== undefined) {
      fourSquareStr = fourSquareStr + 'address: ' + address + '<br>';
    }

    var category = venue.categories.shortName;
    if (category !== null && category !== undefined) {
      fourSquareStr = fourSquareStr + 'category: ' + category + '<br>';
    }

    var checkinCount = venue.stats.checkinsCount;
    if (checkinCount !== null && checkinCount !== undefined) {
      fourSquareStr = fourSquareStr + '# of checkins: ' + checkinCount + '<br>';
    }

    var tipCount = venue.stats.tipCount;

    // if (tipCount > 0) {
    //   _this.getFourSquareTips(venueId, pt);
    // } else {
    //   fourSquareStr = fourSquareStr + '</p>';
    //   _this.checkPano();
    // }

    console.log('andrewcfoursquare2', fourSquareStr);
    return fourSquareStr;
  }

  getFourSquareDetailsForPlacePromise
    .then((response) => {
      const infoWindow = new google.maps.InfoWindow({
        content: response
      });
      infoWindow.open(map, marker);
    });

  // $.getJSON(url).done(function(response) {
  //   console.log('response', response);
  //     .fail(function() {
  //       fourSquareStr = 'Four square data request failed';
  //       console.error('Four square failed to load information' +
  //           'attempting to load error  we can get into info window');
  //       _this.checkPano();
  //     });
};

GoogleMapsApiLoader({
  libraries: ['places'],
  apiKey: googleApiKey
}).then(function (googleApi) {
  initMap();
  var autocomplete = new googleApi.maps.places.AutocompleteService();

  loadPlacesDataList();

  // Update the placeholder text.
  input.placeholder = "e.g. datalist";
}, function (err) {
  console.error(err);
});
