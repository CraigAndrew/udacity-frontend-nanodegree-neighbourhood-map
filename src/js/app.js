// // Entry Point for application.
//
// // imports
import _ from 'lodash';
import $ from 'jquery';
import ko from 'knockout';
import GoogleMapsApiLoader from 'google-maps-api-loader';

// constant declarations
let fourSquareClientId = '0FD1PHV1YKMHSMF0T1M1PFIFLWRB12EQAGRDIK5Z2WOJOVNQ';
let fourSquareClientSecret = 'XXASVO0SW14RJKNE0ETMNNATAPQVBO0PPJA5WFNATBPW3J3L';
const defaultLat = -29.83608;
const defaultLng = 30.918399;
const googleApiKey = 'AIzaSyC_77S5Ozh5RMPEQ98QBA9iOSHPQxZM_N8';
let placesModel;

function toggleMarkerBounceAnimation(marker) {
  toggleMarkerAnimation(marker, google.maps.Animation.BOUNCE);
}

function toggleMarkerAnimation(marker, animation) {
  if (!_.isNull(marker.getAnimation())) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(animation);
  }
}

GoogleMapsApiLoader({
  libraries: ['places'],
  apiKey: googleApiKey
}).then(function (googleApi) {
  console.log('2');
  initialize();
  console.log('3');

  initializePlaces();
  // let autocomplete = new googleApi.maps.places.AutocompleteService();
  //
  // loadPlacesDataList();
  //
  // // Update the placeholder text.
  // input.placeholder = "e.g. datalist";
}, function (err) {
  console.error(err);
});

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

let map;
function initialize() {
  let mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(defaultLat, defaultLng),
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map'),
      mapOptions);
}

// Place Class completely builds everything needed for each location marker.
let Place = function(title, lng, lat, venueId, cat) {
  let self = this;
  this.title = title;
  this.lng = lng;
  this.lat = lat;
  this.venueId = venueId;
  this.cat = cat;

// getConetent function retrieves 5 most recent tips from foursquare for the marker location.
  this.getContent = function() {
    console.log('getContent');

    let topTips = [];
    let venueUrl = `https://api.foursquare.com/v2/venues/${self.venueId}/tips?sort=recent&limit=5&v=20150609&client_id=${fourSquareClientId}&client_secret=${fourSquareClientSecret}`;

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
    case "shop":
      this.icon = 'src/css/img/shop.png';
      break;
    case "eat":
      this.icon = 'src/css/img/eat.png';
      break;
    default:
      this.icon = 'src/css/img/default.png';
  }

  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(self.lng, self.lat),
    map: map,
    title: self.title,
    icon: self.icon
  });

  // Opens the info window for the location marker.
  this.openInfowindow = function() {
    for (let i=0; i < placesModel.locations.length; i++) {
      placesModel.locations[i].infowindow.close();
    }
    map.panTo(self.marker.getPosition())
    self.infowindow.setContent(self.content);
    self.infowindow.open(map,self.marker);
    toggleMarkerBounceAnimation(this.marker);
  };

  // Assigns a click event listener to the marker to open the info window.
  this.addListener = google.maps.event.addListener(self.marker,'click', (this.openInfowindow));
  console.log('Place end');
};

// Contains all the locations and search function.
placesModel = {
  locations:[],
  query: ko.observable(''),
};

// Search function for filtering through the list of locations based on the name of the location.
placesModel.search = ko.dependentObservable(function() {
  console.log('search', placesModel.locations);

  let self = this;
  let search = this.query().toLowerCase();
  return ko.utils.arrayFilter(self.locations, function(location) {
    return location.title.toLowerCase().indexOf(search) >= 0;
  });
}, placesModel);

function initializePlaces() {
  console.log('initializePlaces');
  placesModel.locations = [
    new Place('The Pavilion Shopping Center', -29.849002300639423, 30.93577734073859, '4cdd6918d4ecb1f701298548', 'Shopping'),
    new Place('Westville Mall', -29.83608, 30.918399, '4ad4c00af964a5203ded20e3', 'Shopping'),
    new Place('Kauai', -29.83608, 30.918399, '4adc8051f964a520b92c21e3', 'Shopping'),
    new Place('Olive & Oil Cafe', 29.839529871456172, 30.925247375447384, '4bb8979c3db7b713c965219a', 'Shopping'),
    new Place('Waxy O\'Connors', -29.827756663602152, 30.929725103495258, '4b6b5120f964a52078002ce3', 'Shopping'),
    new Place('Lupa Osteria', -29.8277474062012, 30.930414401226106, '4d615493e4fe5481a8618a9e', 'Shopping'),
    new Place('Chez nous', -29.836469892379846, 30.91703684659349, '4c84e24574d7b60ca66196d8', 'Shopping')
  ];
  console.log('initializePlaces End', placesModel.locations);
}

ko.applyBindings(placesModel);

// TODO: Filter markers on input type
// TODO: When clicking on marker highlight item in listview
// TODO: just display phone number and address in infowindow
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
