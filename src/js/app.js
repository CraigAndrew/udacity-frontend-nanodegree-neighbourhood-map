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
  query: ko.observable(''),
  showInfoWindow,
  unhighlightPlace: Util.unhighlightPlace
};

/**
 * Search function for input search query. Filters down list of places shown in list as well as markers visible.
 */
viewModel.search = ko.computed(function() {
  const _this = this;
  const search = _this.query().toLowerCase();
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

function setupMarkerClickListener({ marker, info }) {
  marker.infoWindow = new google.maps.InfoWindow();
  marker.addListener = google.maps.event.addListener(marker, 'click', () => {
    Util.centerAndPanMap(map, marker);
    Util.closeOpenInfoWindows(viewModel);
    marker.infoWindow.setContent(info);
    marker.infoWindow.open(map, marker);
    _.defer(() => Util.toggleMarkerBounceAnimation(marker));
  });
}

ko.applyBindings(viewModel);
