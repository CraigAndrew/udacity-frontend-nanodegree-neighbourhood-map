/**
 * Created by andrewc on 4/10/2017.
 */
const Util = {};
import _ from 'lodash';
import $ from 'jquery';
import Places from './places.json';
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
 *
 * @param marker
 */
Util.toggleMarkerBounceAnimation = function(marker, delay = 500) {
  setTimeout(() => this.toggleMarkerAnimation(marker, bounceTwiceAnimation, delay));
}

/**
 *
 * @param marker
 * @param animation
 */
Util.toggleMarkerAnimation = function(marker, animation) {
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
Util.isMobile = function() {
  return (/Mobi/.test(navigator.userAgent));
}

/**
 *
 */
Util.setupListUi = function() {
  $('span#arrow').click(() => {
    $('ul').slideToggle();
  });
  $( window ).resize(() => {
    if (Util.isMobile()) {
      $('ul').slideUp();
    } else {
      $('ul').slideDown();
    }
  });

  $('ul').slideDown();
}

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
}

Util.highlightPlace = function(place) {
  place.marker.setIcon(`${imgPath}active.png`);
}

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
}

Util.closeOpenInfoWindows = function(viewModel) {
  _.forEach(viewModel.places, ({ marker: { infoWindow } }) => {
    if (infoWindow) {
      infoWindow.close();
    }
  });
}

Util.openInfoWindowForActiveMarker = function(map, marker, info) {
  marker.infoWindow.setContent(info);
  marker.infoWindow.open(map, marker);
}

Util.adjustMapForActiveMarker = function(map, marker) {
  Util.centerAndPanMap(map, marker);
  Util.toggleMarkerBounceAnimation(marker);
}

Util.setupPlaces = function() {
  const placesArr = [];
  _.forEach(_.sortBy(Places, 'name'), ({ name, cat, lng, lat }) => {
    placesArr.push(new Place(name, cat, lng, lat))
  });
  return placesArr;
}

Util.centerAndPanMap = function(map, marker) {
  map.setCenter(marker.getPosition());
  map.panTo(marker.getPosition());
}

export default Util;
