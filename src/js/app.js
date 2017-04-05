// // Entry Point for application.
//
// // imports
import _ from 'lodash';
import $ from 'jquery';
import ko from 'knockout';
import GoogleMapsApiLoader from 'google-maps-api-loader';

// constant declarations
const defaultLat = -29.83608;
const defaultLng = 30.918399;
const defaultZoomLevel = 15;
const fourSquareClientId = '0FD1PHV1YKMHSMF0T1M1PFIFLWRB12EQAGRDIK5Z2WOJOVNQ';
const fourSquareClientSecret = 'XXASVO0SW14RJKNE0ETMNNATAPQVBO0PPJA5WFNATBPW3J3L';
const googleApiKey = 'AIzaSyC_77S5Ozh5RMPEQ98QBA9iOSHPQxZM_N8';
let map;
let placesModel;

function toggleMarkerBounceAnimation(marker) {
  toggleMarkerAnimation(marker, google.maps.Animation.BOUNCE);
}

function toggleMarkerAnimation(marker, animation) {
  if (marker.getAnimation()) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(animation);
  }
}

GoogleMapsApiLoader({
  libraries: ['places'],
  apiKey: googleApiKey
}).then(function (googleApi) {
  initialize();
  initializePlaces();
  const autocomplete = new googleApi.maps.places.AutocompleteService();
  // Update the placeholder text.
  // input.placeholder = "e.g. datalist";
}, function (err) {
  console.error(err);
});

function initialize() {
  let mapOptions = {
    zoom: defaultZoomLevel,
    center: new google.maps.LatLng(defaultLat, defaultLng),
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map'),
      mapOptions);
}

// Place Class completely builds everything needed for each location marker.
let Place = function(name, cat, lng, lat) {
  let _this = this;
  this.name = name;
  this.lng = lng;
  this.lat = lat;
  this.cat = cat;

// getContent function retrieves 5 most recent tips from foursquare for the marker location.
  this.getContent = function() {
    const url = `https://api.foursquare.com/v2/venues/search?client_id=${fourSquareClientId}&client_secret=${fourSquareClientSecret}&v=20130815&ll=${_this.lng},${_this.lat}&query=\'${_this.name}\'&limit=1`;

    $.getJSON(url).done(({ response }) => {
      const venue = response.venues[0];
      const venueName = venue.name;
      const categoryName = venue.categories[0].name;
      const location = venue.location;
      const formattedAddress = location.formattedAddress;
      _this.content = `<h2>${venueName}</h2><h3>${categoryName}</h3><h4>${formattedAddress}</h4>`;
    }).fail(function(jqXHR, textStatus, errorThrown) {
      console.log('getJSON request failed! ' + textStatus);
    });
  }();

  this.infowindow = new google.maps.InfoWindow();

  // Assigns a marker icon color based on the category of the location.
  const imgPath = 'src/css/img/';
  switch (this.cat) {
    case "eat":
      this.icon = imgPath + 'eat.png';
      break;
    case "shop":
      this.icon = imgPath + 'shop.png';
      break;
    default:
      this.icon = imgPath + 'default.png';
  }

  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(_this.lng, _this.lat),
    animation: google.maps.Animation.DROP,
    map,
    name: _this.name,
    icon: _this.icon
  });

  this.markerObs = ko.observable(this.marker);

  // Opens the info window for the location marker.
  this.openInfowindow = function() {
    toggleMarkerBounceAnimation(_this.marker);
    for (let i=0; i < placesModel.locations.length; i++) {
      placesModel.locations[i].infowindow.close();
    }
    map.panTo(_this.marker.getPosition())
    _this.infowindow.setContent(_this.content);
    _this.infowindow.open(map,_this.marker);
  };

  // Assigns a click event listener to the marker to open the info window.
  this.addListener = google.maps.event.addListener(_this.marker,'click', (this.openInfowindow));
};

// Contains all the locations and search function.
placesModel = {
  locations:[],
  query: ko.observable(''),
};

// Search function for filtering through the list of locations based on the name of the location.
placesModel.search = ko.dependentObservable(function() {
  const _this = this;
  const search = this.query().toLowerCase();
  return ko.utils.arrayFilter(_this.locations, function(location) {
    const match =  location.name.toLowerCase().indexOf(search) >= 0;
    if (!match) {
      location.marker.setVisible(false);
    } else {
      location.marker.setVisible(true);
    }
    return match;
  });
}, placesModel);

function initializePlaces() {
  placesModel.locations = [
    new Place('The Pavilion Shopping Center', 'shop', -29.849002300639423, 30.93577734073859, '4cdd6918d4ecb1f701298548'),
    new Place('Westville Mall', 'shop', -29.83608, 30.918399, '4ad4c00af964a5203ded20e3'),
    new Place('Kauai', 'eat', -29.83608, 30.918399, '4adc8051f964a520b92c21e3'),
    new Place('Olive & Oil Cafe', 'eat', 29.839529871456172, 30.925247375447384, '4bb8979c3db7b713c965219a'),
    new Place('Waxy O\'Connors', 'eat', -29.827756663602152, 30.929725103495258, '4b6b5120f964a52078002ce3'),
    new Place('Lupa Osteria', 'eat', -29.8277474062012, 30.930414401226106, '4d615493e4fe5481a8618a9e'),
    new Place('Chez nous', 'eat', -29.836469892379846, 30.91703684659349, '4c84e24574d7b60ca66196d8')
  ];
}

ko.applyBindings(placesModel);

// TODO: When clicking on marker highlight item in listview
// TODO: Responsive design, mobile-first if you can
// TODO: Google Autocomplete
// NICE TO HAVE: MINIFY JS, CSS etc


// const observablePlaces = ko.observableArray(places);
// const defaultZoomLevel = 15;
// let map;
//
// /**
//  * Temporary init map function.
//  */
// function initMap() {
//   let latLng = {lat: defaultLat, lng: defaultLng};
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: latLng,
//     zoom: defaultZoomLevel
//   });
//
//   places.forEach(({ name, lat, lng })=> {
//     const marker = new google.maps.Marker({
//       position: { lat, lng },
//       map: map
//     });
//     marker.addListener('click', () => {
//       const place = _.find(places, { name });
//       if (place) {
//         moveToMarker(place);
//       }
//     });
//   });
// }
//
// function loadPlacesDataList() {
//   // Get the <datalist> and <input> elements.
//   let dataList = document.getElementById('dataPlaces');
//   let input = document.getElementById('places');
//
//   // Loop over the JSON array.
//   places.forEach(function ({ name }) {
//     // Create a new <option> element.
//     let option = document.createElement('option');
//     // Set the value using the item in the JSON array.
//     option.value = name;
//
//     // Add the <option> element to the <datalist>.
//     dataList.append(option);
//   });
// }
//
// function moveToMarker(place) {
//   map.panTo( new google.maps.LatLng( place.lat, place.lng ) );
//   const marker = new google.maps.Marker({
//     position: {
//       lat: place.lat,
//       lng: place.lng
//     },
//     map
//   });
//
//   const fourSquareDetails = getFourSquareDetails(marker, place);
// }
//
// /**
//  * Gets details via Four Square API
//  */
// function getFourSquareDetails(marker, place) {
//   let url = `https://api.foursquare.com/v2/venues/search?client_id=${fourSquareClientId}&client_secret=${fourSquareClientSecret}&v=20130815&ll=
//     ${place.lat},${place.lng}&query=\'${place.name}\'&limit=1`;
//
//   const getFourSquareDetailsForPlacePromise = new Promise((resolve, reject) => {
//     $.getJSON(url).done(function(response) {
//       console.log('response', response);
//       resolve(formatFourSquareDetailsForPlaceMarkerDisplay(response));
//     });
//   });
//
//   function formatFourSquareDetailsForPlaceMarkerDisplay(response) {
//     let fourSquareStr = '<p>Foursquare info:<br>';
//     let venue = response.response.venues[0];
//     let venueId = venue.id;
//     let venueName = venue.name;
//
//     if (venueName !== null && venueName !== undefined) {
//       fourSquareStr = fourSquareStr + 'name: ' + venueName + '<br>';
//     }
//
//     let phoneNum = venue.contact.formattedPhone;
//     if (phoneNum !== null && phoneNum !== undefined) {
//       fourSquareStr = fourSquareStr + 'phone: ' + phoneNum + '<br>';
//     }
//
//     let twitterId = venue.contact.twitter;
//     if (twitterId !== null && twitterId !== undefined) {
//       fourSquareStr = fourSquareStr + 'twitter name: ' +
//           twitterId + '<br>';
//     }
//
//     let address = venue.location.formattedAddress;
//     if (address !== null && address !== undefined) {
//       fourSquareStr = fourSquareStr + 'address: ' + address + '<br>';
//     }
//
//     let category = venue.categories.shortName;
//     if (category !== null && category !== undefined) {
//       fourSquareStr = fourSquareStr + 'category: ' + category + '<br>';
//     }
//
//     let checkinCount = venue.stats.checkinsCount;
//     if (checkinCount !== null && checkinCount !== undefined) {
//       fourSquareStr = fourSquareStr + '# of checkins: ' + checkinCount + '<br>';
//     }
//
//     let tipCount = venue.stats.tipCount;
//
//     // if (tipCount > 0) {
//     //   _this.getFourSquareTips(venueId, pt);
//     // } else {
//     //   fourSquareStr = fourSquareStr + '</p>';
//     //   _this.checkPano();
//     // }
//
//     console.log('andrewcfoursquare2', fourSquareStr);
//     return fourSquareStr;
//   }
//
//   getFourSquareDetailsForPlacePromise
//     .then((response) => {
//       const infoWindow = new google.maps.InfoWindow({
//         content: response
//       });
//       infoWindow.open(map, marker);
//     });
//
//   // $.getJSON(url).done(function(response) {
//   //   console.log('response', response);
//   //     .fail(function() {
//   //       fourSquareStr = 'Four square data request failed';
//   //       console.error('Four square failed to load information' +
//   //           'attempting to load error  we can get into info window');
//   //       _this.checkPano();
//   //     });
// };
//
// // Here's my data model
// let ViewModel = function(first, last) {
//   this.dataPlaces = ko.observableArray([]);
//   this.firstName = ko.observable(first);
//   this.lastName = ko.observable(last);
//   this.text = ko.observable();
//   this.filter =  ko.observable("");
//   this.updated = ko.computed(function (val) {
//     console.log('val', val);
//   });
//   this.fullName = ko.pureComputed(function() {
//     // Knockout tracks dependencies automatically. It knows that fullName depends on firstName and lastName, because these get called when evaluating fullName.
//     return this.firstName() + " " + this.lastName();
//   }, this);
//
//   this.test = function() {
//     console.log('andrewc test');
//   };
// };
//
// ko.applyBindings(new ViewModel("Planet", "Earth")); // This makes Knockout get to work
//
// GoogleMapsApiLoader({
//   libraries: ['places'],
//   apiKey: googleApiKey
// }).then(function (googleApi) {
//   initMap();
//   let autocomplete = new googleApi.maps.places.AutocompleteService();
//
//   loadPlacesDataList();
//
//   // Update the placeholder text.
//   input.placeholder = "e.g. datalist";
// }, function (err) {
//   console.error(err);
// });
