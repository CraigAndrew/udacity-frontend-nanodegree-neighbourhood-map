'use strict';
// // Entry Point for application.
//
// imports
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

// Contains all the places and search function.
viewModel = {
  places: [
    new Place('The Pavilion Shopping Center', 'shop', -29.849002300639423, 30.93577734073859),
    new Place('Westville Mall', 'shop', -29.83608, 30.918399),
    new Place('Kauai', 'eat', -29.83608, 30.918399),
    new Place('Olive & Oil Cafe', 'eat', 29.839529871456172, 30.925247375447384),
    new Place('Waxy O\'Connors', 'eat', -29.827756663602152, 30.929725103495258),
    new Place('Lupa Osteria', 'eat', -29.8277474062012, 30.930414401226106),
    new Place('Chez nous', 'eat', -29.836469892379846, 30.91703684659349)
  ],
  query: ko.observable(''),
  showInfoWindow,
  highlightPlace: Util.highlightPlace,
  unhighlightPlace: Util.unhighlightPlace
};

/**
 *
 */
// Search function for filtering through the list of places based on the name of the location.
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

function setupMarkersForPlaces() {
  _.forEach(viewModel.places, (location) => {
    location.marker = new google.maps.Marker({
      position: new google.maps.LatLng(location.lng, location.lat),
      animation: google.maps.Animation.DROP,
      map,
      name: location.name,
      icon: location.icon
    });

    location.marker.infoWindow = new google.maps.InfoWindow();

    // Assigns a click event listener to the marker to open the info window.
    location.marker.addListener = google.maps.event.addListener(location.marker, 'click', () => {
      map.setCenter(location.marker.getPosition());
      for (let i=0; i < viewModel.places.length; i++) {
        if (viewModel.places[i].marker.infoWindow) {
          viewModel.places[i].marker.infoWindow.close();
        }
      }
      map.panTo(location.marker.getPosition());
      location.marker.infoWindow.setContent(location.info);
      location.marker.infoWindow.open(map, location.marker);
      _.defer(() => Util.toggleMarkerBounceAnimation(location.marker));
    });
  });
}

/**
 *
 */
GoogleMapsApiLoader({
  libraries: ['places'],
  apiKey: googleApiKey
}).then((googleApi) => {
  map = MapHelper.initializeMap();
  setupMarkersForPlaces();
  Util.setupListUi();
}, (err) => {
  console.error(err);
});

ko.applyBindings(viewModel);
