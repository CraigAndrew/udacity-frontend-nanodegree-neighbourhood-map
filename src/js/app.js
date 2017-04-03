// // Entry Point for application.
//
// // imports
import _ from 'lodash';
import $ from 'jquery';
import ko from 'knockout';
import GoogleMapsApiLoader from 'google-maps-api-loader';
//
// // constant declarations
var fourSquareClientId = '0FD1PHV1YKMHSMF0T1M1PFIFLWRB12EQAGRDIK5Z2WOJOVNQ';
var fourSquareClientSecret = 'XXASVO0SW14RJKNE0ETMNNATAPQVBO0PPJA5WFNATBPW3J3L';
const defaultLat = -29.83608;
const defaultLng = 30.918399;
const googleApiKey = 'AIzaSyC_77S5Ozh5RMPEQ98QBA9iOSHPQxZM_N8';
// const places = [
//   { name: 'The Pavilion Shopping Center', lat: -29.849002300639423, lng: 30.93577734073859 },
//   { name: 'Westville Mall', lat: -29.83608, lng: 30.918399 },
//   { name: 'Kauai', lat: -29.83608, lng: 30.918399 },
//   { name: 'Olive & Oil Cafe', lat: 29.839529871456172, lng: 30.925247375447384 },
//   { name: 'Waxy O\'Connors', lat: -29.827756663602152, lng: 30.929725103495258 },
//   { name: 'Lupa Osteria', lat: -29.8277474062012, lng: 30.930414401226106 },
//   { name: 'Chez nous', lat: -29.836469892379846, lng: 30.91703684659349 }
// ];
// const observablePlaces = ko.observableArray(places);
// const defaultZoomLevel = 15;
// let map;
//
// /**
//  * Temporary init map function.
//  */
// function initMap() {
//   var latLng = {lat: defaultLat, lng: defaultLng};
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
//   var dataList = document.getElementById('dataPlaces');
//   var input = document.getElementById('places');
//
//   // Loop over the JSON array.
//   places.forEach(function ({ name }) {
//     // Create a new <option> element.
//     var option = document.createElement('option');
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
//   var url = `https://api.foursquare.com/v2/venues/search?client_id=${fourSquareClientId}&client_secret=${fourSquareClientSecret}&v=20130815&ll=
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
//     var venue = response.response.venues[0];
//     var venueId = venue.id;
//     var venueName = venue.name;
//
//     if (venueName !== null && venueName !== undefined) {
//       fourSquareStr = fourSquareStr + 'name: ' + venueName + '<br>';
//     }
//
//     var phoneNum = venue.contact.formattedPhone;
//     if (phoneNum !== null && phoneNum !== undefined) {
//       fourSquareStr = fourSquareStr + 'phone: ' + phoneNum + '<br>';
//     }
//
//     var twitterId = venue.contact.twitter;
//     if (twitterId !== null && twitterId !== undefined) {
//       fourSquareStr = fourSquareStr + 'twitter name: ' +
//           twitterId + '<br>';
//     }
//
//     var address = venue.location.formattedAddress;
//     if (address !== null && address !== undefined) {
//       fourSquareStr = fourSquareStr + 'address: ' + address + '<br>';
//     }
//
//     var category = venue.categories.shortName;
//     if (category !== null && category !== undefined) {
//       fourSquareStr = fourSquareStr + 'category: ' + category + '<br>';
//     }
//
//     var checkinCount = venue.stats.checkinsCount;
//     if (checkinCount !== null && checkinCount !== undefined) {
//       fourSquareStr = fourSquareStr + '# of checkins: ' + checkinCount + '<br>';
//     }
//
//     var tipCount = venue.stats.tipCount;
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
// var ViewModel = function(first, last) {
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
//   var autocomplete = new googleApi.maps.places.AutocompleteService();
//
//   loadPlacesDataList();
//
//   // Update the placeholder text.
//   input.placeholder = "e.g. datalist";
// }, function (err) {
//   console.error(err);
// });
console.log('1');
let locationsModel;

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

GoogleMapsApiLoader({
  libraries: ['places'],
  apiKey: googleApiKey
}).then(function (googleApi) {
  console.log('2');
  initialize();
  console.log('3');

  setupLocations();
  // var autocomplete = new googleApi.maps.places.AutocompleteService();
  //
  // loadPlacesDataList();
  //
  // // Update the placeholder text.
  // input.placeholder = "e.g. datalist";
}, function (err) {
  console.error(err);
});

// function initMap() {
//   var latLng = {lat: defaultLat, lng: defaultLng};
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

let map;
function initialize() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(defaultLat, defaultLng),
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map'),
  mapOptions);
}

// Location Class completely builds everything needed for each location marker.
var Location = function(title, lng, lat, venueId, cat) {
  var self = this;
  this.title = title;
  this.lng = lng;
  this.lat = lat;
  this.venueId = venueId;
  this.cat = cat;

// getConetent function retrieves 5 most recent tips from foursquare for the marker location.
  this.getContent = function() {
    console.log('getContent');

    var topTips = [];
    var venueUrl = `https://api.foursquare.com/v2/venues/${self.venueId}/tips?sort=recent&limit=5&v=20150609&client_id=${fourSquareClientId}&client_secret=${fourSquareClientSecret}`;

    console.log('g1');

    $.getJSON(venueUrl,
        function(data) {
          $.each(data.response.tips.items, function(i, tips){
            topTips.push('<li>' + tips.text + '</li>');
          });

        }).done(function(){

      self.content = '<h2>' + self.title + '</h2>' + '<h3>5 Most Recent Comments</h3>' + '<ol class="tips">' + topTips.join('') + '</ol>';
    }).fail(function(jqXHR, textStatus, errorThrown) {
      self.content = '<h2>' + self.title + '</h2>' + '<h3>5 Most Recent Comments</h3>' + '<h4>Oops. There was a problem retrieving this location\'s comments.</h4>';
      console.log('getJSON request failed! ' + textStatus);
    });
  }();

  console.log('g2.1');
  this.infowindow = new google.maps.InfoWindow();
  console.log('g3');

  // Assigns a marker icon color based on the category of the location.
  switch (this.cat) {
    case "Shopping":
      this.icon = 'http://www.googlemapsmarkers.com/v1/009900/';
      break;
    case "Food":
      this.icon = 'http://www.googlemapsmarkers.com/v1/0099FF/';
      break;
    default:
      this.icon = 'http://www.googlemapsmarkers.com/v1/990000/';
  }
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(self.lng, self.lat),
    map: map,
    title: self.title,
    icon: self.icon
  });

  // Opens the info window for the location marker.
  this.openInfowindow = function() {
    for (var i=0; i < locationsModel.locations.length; i++) {
      locationsModel.locations[i].infowindow.close();
    }
    map.panTo(self.marker.getPosition())
    self.infowindow.setContent(self.content);
    self.infowindow.open(map,self.marker);
    toggleBounce(this.marker);
  };

  // Assigns a click event listener to the marker to open the info window.
  this.addListener = google.maps.event.addListener(self.marker,'click', (this.openInfowindow));
  console.log('Location end');
};

// Contains all the locations and search function.
locationsModel = {
  locations:[],
  query: ko.observable(''),
};

// Search function for filtering through the list of locations based on the name of the location.
locationsModel.search = ko.dependentObservable(function() {
  console.log('search', locationsModel.locations);

  var self = this;
  var search = this.query().toLowerCase();
  return ko.utils.arrayFilter(self.locations, function(location) {
    return location.title.toLowerCase().indexOf(search) >= 0;
  });
}, locationsModel);

function setupLocations() {
  console.log('setupLocations');
  locationsModel.locations = [
  new Location('Penzeys Spices', 35.78961, -78.66032, '4cdd6918d4ecb1f701298548', 'Shopping'),
      new Location('Raleigh Flea Market', 35.79499, -78.70719, '4ad4c00af964a5203ded20e3', 'Shopping'),
      new Location('Reader\'s Corner', 35.79005, -78.67937, '4adc8051f964a520b92c21e3', 'Shopping'),
      new Location('State Farmers Market', 35.76363, -78.66274, '4bb8979c3db7b713c965219a', 'Shopping'),
      new Location('Capital RunWalk', 35.79039, -78.65867, '4b6b5120f964a52078002ce3', 'Shopping'),
      new Location('Watson\'s Market Place & Flea Market', 35.76063, -78.61596, '4d615493e4fe5481a8618a9e', 'Shopping'),
      new Location('Raleigh Denim', 35.77665, -78.64465, '4c84e24574d7b60ca66196d8', 'Shopping'),
      new Location('Cloos\' Coney Island', 35.77770, -78.67485, '4afee1fdf964a520333122e3', 'Food'),
      new Location('Franks Pizza', 35.77880, -78.60704, '4aecb1b2f964a52056ca21e3', 'Food'),
      new Location('Snoopy\'s Hot Dogs & More', 35.80719, -78.62499, '4bf6c03013aed13a6823eaf7', 'Food'),
      new Location('Clyde Cooper\'s Barbecue', 35.77630, -78.63831, '4b63170ef964a52039622ae3', 'Food')
  ];
  console.log('setupLocations End', locationsModel.locations);
}

ko.applyBindings(locationsModel);