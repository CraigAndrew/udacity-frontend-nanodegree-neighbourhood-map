'use strict';
import _ from 'lodash';
import ko from 'knockout';
import GoogleMapsApiLoader from 'google-maps-api-loader';
import MapHelper from './map-helper';
import Util from './util';
import Places from './places.json';

// constant declarations
const googleApiKey = 'AIzaSyC_77S5Ozh5RMPEQ98QBA9iOSHPQxZM_N8';
let map;
let viewModel;

/**
 * Entry Point for application.
 */
GoogleMapsApiLoader({
  libraries: ['places'],
  apiKey: googleApiKey
}).then(() => {
  map = MapHelper.initializeMap();
  setupMarkersForPlaces();
  Util.setupListUi();
}, (err) => {
  console.error('error for developer', err);
  alert('Problem loading Google Maps library. Please try again later');
});

/**
 * Place model constructor to create a place object based on place info and google marker properties
 *
 * @param name
 * @param cat
 * @param lng
 * @param lat
 * @constructor
 */
const Place = function(name, cat, lng, lat) {
  this.name = name;
  this.lng = lng;
  this.lat = lat;
  this.cat = cat;
  Util.fetchInfo(this);
};

/**
 * Display GoogleMaps InfoWindow for place with place info from 3rd party service
 *
 * @param place
 */
const showInfoWindow = function(place) {
  map.setCenter(place.marker.getPosition());
  _.forEach(viewModel.places, ({ marker: { infoWindow } }) => {
    if (infoWindow) {
      infoWindow.close();
    }
  });
  map.panTo(place.marker.getPosition())
  place.marker.infoWindow.setContent(place.info);
  place.marker.infoWindow.open(map, place.marker);
  _.defer(() => Util.toggleMarkerBounceAnimation(place.marker));
}

viewModel = {
  highlightPlace: Util.highlightPlace,
  places: setupPlaces(),
  query: ko.observable(''),
  showInfoWindow,
  unhighlightPlace: Util.unhighlightPlace
};

function setupPlaces() {
  const placesArr = [];
  _.forEach(Places, ({ name, cat, lng, lat }) => {
    placesArr.push(new Place(name, cat, lng, lat))
  });
  return placesArr;
}

/**
 * Search function for input search query. Filters down list of places shown in list as well as markers visible.
 */
viewModel.search = ko.computed(function() {
  const _this = this;
  const search = _this.query().toLowerCase();
  let searchResults = ko.utils.arrayFilter(_this.places, ({ name, marker }) => {
    const match =  name.toLowerCase().indexOf(search) >= 0;
    if (!match) {
      if (marker) {
        marker.setVisible(false);
      }
    } else {
      if (marker) {
        marker.setVisible(true);
      }
    }
    return match;
  });

  if (_.isEmpty(searchResults)) {
    searchResults = viewModel.places;
  }

  return searchResults;
}, viewModel);

/**
 * Sets up the Google Maps markers on the map for each place.
 */
function setupMarkersForPlaces() {
  _.forEach(viewModel.places, (place) => {
    place.marker = new google.maps.Marker({
      position: new google.maps.LatLng(place.lng, place.lat),
      animation: google.maps.Animation.DROP,
      map,
      name: place.name,
      icon: place.icon
    });

    place.marker.infoWindow = new google.maps.InfoWindow();
    place.marker.addListener = google.maps.event.addListener(place.marker, 'click', () => {
      map.setCenter(place.marker.getPosition());
      _.forEach(viewModel.places, ({ marker: { infoWindow } }) => {
        if (infoWindow) {
          infoWindow.close();
        }
      });
      map.panTo(place.marker.getPosition());
      place.marker.infoWindow.setContent(place.info);
      place.marker.infoWindow.open(map, place.marker);
      _.defer(() => Util.toggleMarkerBounceAnimation(place.marker));
    });
  });
}

ko.applyBindings(viewModel);
