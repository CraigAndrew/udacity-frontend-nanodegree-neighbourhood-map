'use strict';
// // Entry Point for application.
//
// imports
import _ from 'lodash';
import $ from 'jquery';
import ko from 'knockout';
import GoogleMapsApiLoader from 'google-maps-api-loader';

// constant declarations
const bounceTwiceAnimation = 4;
const defaultLat = -29.83608;
const defaultLng = 30.918399;
const defaultZoomLevel = 15;
const fourSquareClientId = '0FD1PHV1YKMHSMF0T1M1PFIFLWRB12EQAGRDIK5Z2WOJOVNQ';
const fourSquareClientSecret = 'XXASVO0SW14RJKNE0ETMNNATAPQVBO0PPJA5WFNATBPW3J3L';
const googleApiKey = 'AIzaSyC_77S5Ozh5RMPEQ98QBA9iOSHPQxZM_N8';
let map;
let placesModel;

function toggleMarkerBounceAnimation(marker) {
  toggleMarkerAnimation(marker, bounceTwiceAnimation);
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
  $("#search-here").click(() => {
    $("#search-area").toggle();
  });
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

  // Opens the info window for the location marker.
  this.openInfowindow = function() {
    map.setCenter(_this.marker.getPosition());
    for (let i=0; i < placesModel.locations.length; i++) {
      placesModel.locations[i].infowindow.close();
    }
    map.panTo(_this.marker.getPosition())
    _this.infowindow.setContent(_this.content);
    _this.infowindow.open(map,_this.marker);
    _.defer(() => toggleMarkerBounceAnimation(_this.marker));
  };

  this.highlightPlace = function() {
    _this.marker.setIcon(imgPath + 'active.png');
  }

  this.unhighlightPlace = function() {
    switch (_this.cat) {
      case "eat":
        _this.marker.setIcon(imgPath + 'eat.png');
        break;
      case "shop":
        _this.marker.setIcon(imgPath + 'shop.png');
        break;
      default:
        _this.marker.setIcon(imgPath + 'default.png');
    }
  }

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
    new Place('The Pavilion Shopping Center', 'shop', -29.849002300639423, 30.93577734073859),
    new Place('Westville Mall', 'shop', -29.83608, 30.918399),
    new Place('Kauai', 'eat', -29.83608, 30.918399),
    new Place('Olive & Oil Cafe', 'eat', 29.839529871456172, 30.925247375447384),
    new Place('Waxy O\'Connors', 'eat', -29.827756663602152, 30.929725103495258),
    new Place('Lupa Osteria', 'eat', -29.8277474062012, 30.930414401226106),
    new Place('Chez nous', 'eat', -29.836469892379846, 30.91703684659349)
  ];
}

ko.applyBindings(placesModel);

// TODO: Responsive design, mobile-first if you can
// TODO: Bring up error message if scripts fail to load
// TODO: Google Autocomplete
// NICE TO HAVE: MINIFY JS, CSS etc
// TODO: When clicking on marker highlight item in listview