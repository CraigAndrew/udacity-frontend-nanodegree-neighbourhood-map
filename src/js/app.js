'use strict';
// // Entry Point for application.
//
// imports
import _ from 'lodash';
import $ from 'jquery';
import ko from 'knockout';
import GoogleMapsApiLoader from 'google-maps-api-loader';
import MapHelper from './map-helper';

// constant declarations
const bounceTwiceAnimation = 4;
const fourSquareClientId = '0FD1PHV1YKMHSMF0T1M1PFIFLWRB12EQAGRDIK5Z2WOJOVNQ';
const fourSquareClientSecret = 'XXASVO0SW14RJKNE0ETMNNATAPQVBO0PPJA5WFNATBPW3J3L';
const googleApiKey = 'AIzaSyC_77S5Ozh5RMPEQ98QBA9iOSHPQxZM_N8';
const imgPath = 'src/css/img/';
let map;
let placesModel;

/**
 *
 * @param marker
 */
function toggleMarkerBounceAnimation(marker) {
  toggleMarkerAnimation(marker, bounceTwiceAnimation);
}

/**
 *
 * @param marker
 * @param animation
 */
function toggleMarkerAnimation(marker, animation) {
  if (marker.getAnimation()) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(animation);
  }
}

/**
 *
 * @returns {boolean}
 */
function isMobile() {
  return (/Mobi/.test(navigator.userAgent));
}

/**
 *
 * @param name
 * @param cat
 * @param lng
 * @param lat
 * @constructor
 */
// Place Class completely builds everything needed for each location marker.
let Place = function(name, cat, lng, lat) {
  let _this = this;
  this.name = name;
  this.lng = lng;
  this.lat = lat;
  this.cat = cat;

// getContent function retrieves 5 most recent tips from foursquare for the marker location.
  /**
   *
   */
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
};

// Contains all the locations and search function.
placesModel = {
  locations: [
    new Place('The Pavilion Shopping Center', 'shop', -29.849002300639423, 30.93577734073859),
    new Place('Westville Mall', 'shop', -29.83608, 30.918399),
    new Place('Kauai', 'eat', -29.83608, 30.918399),
    new Place('Olive & Oil Cafe', 'eat', 29.839529871456172, 30.925247375447384),
    new Place('Waxy O\'Connors', 'eat', -29.827756663602152, 30.929725103495258),
    new Place('Lupa Osteria', 'eat', -29.8277474062012, 30.930414401226106),
    new Place('Chez nous', 'eat', -29.836469892379846, 30.91703684659349)
  ],
  query: ko.observable(''),
  showInfoWindow: function(place) {
    console.log('listClickCallback4', place.marker);
    map.setCenter(place.marker.getPosition());
    for (let i=0; i < placesModel.locations.length; i++) {
      if (placesModel.locations[i].marker.infowindow) {
        placesModel.locations[i].marker.infowindow.close();
      }
    }
    map.panTo(place.marker.getPosition())
    place.marker.infowindow.setContent(place.content);
    place.marker.infowindow.open(map, place.marker);
    _.defer(() => toggleMarkerBounceAnimation(place.marker));
  },
  highlightPlace: function(place) {
    place.marker.setIcon(imgPath + 'active.png');
  },
  unhighlightPlace: function(place) {
    switch (place.cat) {
      case "eat":
        place.marker.setIcon(imgPath + 'eat.png');
        break;
      case "shop":
        place.marker.setIcon(imgPath + 'shop.png');
        break;
      default:
        place.marker.setIcon(imgPath + 'default.png');
    }
  }
};

/**
 *
 */
// Search function for filtering through the list of locations based on the name of the location.
placesModel.search = ko.computed(function() {
  const _this = this;
  console.log('search', this);
  const search = this.query().toLowerCase();
  let searchResults = ko.utils.arrayFilter(_this.locations, function(location) {
    const match =  location.name.toLowerCase().indexOf(search) >= 0;
    if (!match) {
      if (location.marker) {
        location.marker.setVisible(false);
      }
    } else {
      if (location.marker) {
        location.marker.setVisible(true);
      }
    }
    return match;
  });

  console.log('searchResults', searchResults);
  if (_.isEmpty(searchResults)) {
    searchResults = placesModel.locations;
    console.log('searchResults default', searchResults);
  }

  return searchResults;
}, placesModel);

/**
 *
 */
function initializePlaces() {
  // placesModel.locations = [
  //   new Place('The Pavilion Shopping Center', 'shop', -29.849002300639423, 30.93577734073859),
  //   new Place('Westville Mall', 'shop', -29.83608, 30.918399),
  //   new Place('Kauai', 'eat', -29.83608, 30.918399),
  //   new Place('Olive & Oil Cafe', 'eat', 29.839529871456172, 30.925247375447384),
  //   new Place('Waxy O\'Connors', 'eat', -29.827756663602152, 30.929725103495258),
  //   new Place('Lupa Osteria', 'eat', -29.8277474062012, 30.930414401226106),
  //   new Place('Chez nous', 'eat', -29.836469892379846, 30.91703684659349)
  // ];
}

function setupMarkersForPlaces() {
  _.forEach(placesModel.locations, (location) => {
    location.marker = new google.maps.Marker({
      position: new google.maps.LatLng(location.lng, location.lat),
      animation: google.maps.Animation.DROP,
      map,
      name: location.name,
      icon: location.icon
    });

    console.log('marker1 in loop', location.marker);
    location.marker.infowindow = new google.maps.InfoWindow();

    // Assigns a click event listener to the marker to open the info window.
    location.marker.addListener = google.maps.event.addListener(location.marker, 'click', () => {
      map.setCenter(location.marker.getPosition());
      for (let i=0; i < placesModel.locations.length; i++) {
        if (placesModel.locations[i].marker.infowindow) {
          placesModel.locations[i].marker.infowindow.close();
        }
      }
      map.panTo(location.marker.getPosition());
      location.marker.infowindow.setContent(location.content);
      location.marker.infowindow.open(map, location.marker);
      _.defer(() => toggleMarkerBounceAnimation(location.marker));
    });
  });
}

/**
 *
 */
GoogleMapsApiLoader({
  libraries: ['places'],
  apiKey: googleApiKey
}).then(function (googleApi) {
  map = MapHelper.initializeMap();
  initializePlaces();
  setupMarkersForPlaces();

  $("span#arrow").click(() => {
    console.log('click');
    console.log($('span#arrow').html());
    $("ul").slideToggle();

    if ($('span#arrow').html() === '▼') {
      $('span#arrow').html('▲');
      $('div.search-area').css({'width': '100%'});
    } else {
      $('span#arrow').html('▼');
      $('div.search-area').css({'width': 'auto'});
    }
  });
  $( window ).resize(function() {
    console.log('window resized');
    if (isMobile()) {
      $("ul").slideUp();
    } else {
      $("ul").slideDown();
    }
  });

  console.log('okay slidedown');
  $("ul").slideDown();
}, function (err) {
  console.error(err);
});

ko.applyBindings(placesModel);
