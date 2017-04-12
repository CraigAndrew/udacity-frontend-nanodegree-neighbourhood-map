const Util = {};

import _ from 'lodash';
import $ from 'jquery';
import Places from './places.json';
import MapHelper from './map-helper';

const bounceTwiceAnimation = 4;
const fourSquareClientId = '0FD1PHV1YKMHSMF0T1M1PFIFLWRB12EQAGRDIK5Z2WOJOVNQ';
const fourSquareClientSecret = 'XXASVO0SW14RJKNE0ETMNNATAPQVBO0PPJA5WFNATBPW3J3L';
const imgPath = 'src/css/img/';

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
  this.cat = cat;
  this.lat = lat;
  this.lng = lng;
  this.name = name;
  Util.fetchInfo(this);
};

/**
 * Toggles bounce animation of marker with a specified delay before it bounces
 * @param marker
 * @param delay
 */
Util.toggleMarkerBounceAnimation = function(marker, delay = 500) {
  setTimeout(() => this.toggleMarkerAnimation(marker, bounceTwiceAnimation, delay));
};

/**
 * Toggles animation of marker
 * @param marker
 * @param animation
 */
Util.toggleMarkerAnimation = function(marker, animation) {
  if (marker.getAnimation()) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(animation);
  }
};

/**
 * Utility function to check if viewing on mobile
 * @returns {boolean}
 */
Util.isMobile = function() {
  return (/Mobi/.test(navigator.userAgent));
};

/**
 * Tidies up list and the UI after initializing and setup of dependencies and data
 */
Util.setupListUi = function(viewModel) {
  $('span#arrow').click(() => {
    $('ul').slideToggle();
  });
  $( window ).resize(() => {
    if (Util.isMobile()) {
      MapHelper.panAndZoomToDefaultPosition();
      Util.closeOpenInfoWindows(viewModel);
      Util.closeList();
    } else {
      Util.openList();
    }
  });

  Util.openList();
};

Util.closeList = function() {
  $('ul').slideUp();
};

Util.openList = function() {
  $('ul').slideDown();
};

/**
 * Fetch FourSquare info for place and set the place's info property
 * @param place
 */
Util.fetchInfo = function(place) {
  const url = `https://api.foursquare.com/v2/venues/search?client_id=${fourSquareClientId}&client_secret=${fourSquareClientSecret}&v=20130815&ll=${place.lng},${place.lat}&query=\'${place.name}\'&limit=1`;

  $.getJSON(url).done(({ response: { venues: [venue] }}) => {
    const venueName = venue.name;
    const categoryName = venue.categories[0].name;
    const location = venue.location;
    const formattedAddress = location.formattedAddress;
    place.info = `<h2>${venueName}</h2><h3>${categoryName}</h3><h4>${formattedAddress}</h4><h6>data by FourSquare</h6>`;
  }).fail((jqXHR, textStatus, errorThrown) => {
    place.info = 'Problem with foursquare. Please try again later';
  });
};

/**
 * Highlight place marker
 * @param place
 */
Util.highlightPlace = function(place) {
  place.marker.setIcon(`${imgPath}active.png`);
};

/**
 * Removes highlight from place marker
 * @param place
 */
Util.unhighlightPlace = function(place) {
  switch (place.cat) {
    case 'eat':
      place.marker.setIcon(`${imgPath}eat.png`);
      break;
    case 'shop':
      place.marker.setIcon(`${imgPath}shop.png`);
      break;
    default:
      place.marker.setIcon(`${imgPath}default.png`);
  }
};

/**
 * Closes any marker's openWindows
 * @param viewModel
 */
Util.closeOpenInfoWindows = function(viewModel) {
  _.forEach(viewModel.places, ({ marker: { infoWindow } }) => {
    if (infoWindow) {
      infoWindow.close();
    }
  });
};

/**
 * Bring focus in the map to the active marker
 * @param marker
 */
Util.adjustMapForActiveMarker = function(marker) {
  MapHelper.panAndZoomToPosition(marker.getPosition());
  Util.toggleMarkerBounceAnimation(marker);
};

/**
 * Loads the places of the neighbourhood from file
 * @returns {Array}
 */
Util.setupPlaces = function() {
  const placesArr = [];
  _.forEach(_.sortBy(Places, 'name'), ({ name, cat, lng, lat }) => {
    placesArr.push(new Place(name, cat, lng, lat))
  });
  return placesArr;
};

export default Util;
