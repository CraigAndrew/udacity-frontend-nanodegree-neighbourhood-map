'use strict';
import _ from 'lodash';
import ko from 'knockout';
import GoogleMapsApiLoader from 'google-maps-api-loader';
import MapHelper from './map-helper';
import Util from './util';

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
 * Display GoogleMaps InfoWindow for place with place info from 3rd party service
 *
 * @param place
 */
const showInfoWindow = function({ marker, info }) {
  Util.closeOpenInfoWindows(viewModel);
  Util.adjustMapForActiveMarker(map, marker);
  Util.openInfoWindowForActiveMarker(map, marker, info);
}

viewModel = {
  highlightPlace: Util.highlightPlace,
  places: Util.setupPlaces(),
  filter: ko.observable(''),
  showInfoWindow,
  unhighlightPlace: Util.unhighlightPlace,
  arrowUp: ko.observable(true),
  toggleArrow: () => {
    viewModel.arrowUp(!viewModel.arrowUp());
  },
  getArrow: ko.pureComputed(() => {
    return (viewModel.arrowUp() ? '▲': '▼');
  })
};

/**
 * Search function for input search filter. Filters down list of places shown in list as well as markers visible.
 */
viewModel.search = ko.computed(function() {
  const _this = this;
  const search = _this.filter().toLowerCase();
  const searchResults = ko.utils.arrayFilter(_this.places, ({ name, marker }) => {
    const match = name.toLowerCase().includes(search);
    marker ? (match ? marker.setVisible(true): marker.setVisible(false)): null;
    return match;
  });

  if (_.isEmpty(searchResults)) {
    return viewModel.places;
  }

  return searchResults;
}, viewModel);


/**
 * Sets up the Google Maps markers on the map for each place.
 */
function setupMarkersForPlaces() {
  _.forEach(viewModel.places, (place) => {
    createMarker(place);
    setupMarkerClickListener(place);
  });
}

function createMarker(place) {
  place.marker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    icon: place.icon,
    map,
    name: place.name,
    position: new google.maps.LatLng(place.lng, place.lat)
  });
}

function setupMarkerClickListener(place) {
  place.marker.infoWindow = new google.maps.InfoWindow();
  place.marker.addListener = google.maps.event.addListener(place.marker, 'click', () => {
    showInfoWindow(place);
  });
}

ko.applyBindings(viewModel);

// TODOS:
// TODO: indicate somewhere in your UI that using Foursquare
// TODO: proper use of knockout 1
// TODO: proper use of knockout 1a - Replace up and down arrow jquery dom manipulation with knockout
// TODO: proper use of knockout 1b - Follow MVVM strictly (separation of view, model and viewmodel concerns)