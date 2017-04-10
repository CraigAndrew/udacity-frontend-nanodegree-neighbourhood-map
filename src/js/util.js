/**
 * Created by andrewc on 4/10/2017.
 */
const Util = {};
import $ from 'jquery';
const bounceTwiceAnimation = 4;
const fourSquareClientId = '0FD1PHV1YKMHSMF0T1M1PFIFLWRB12EQAGRDIK5Z2WOJOVNQ';
const fourSquareClientSecret = 'XXASVO0SW14RJKNE0ETMNNATAPQVBO0PPJA5WFNATBPW3J3L';
const imgPath = 'src/css/img/';

/**
 *
 * @param marker
 */
Util.toggleMarkerBounceAnimation = function(marker) {
  this.toggleMarkerAnimation(marker, bounceTwiceAnimation);
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
  $("span#arrow").click(() => {
    $("ul").slideToggle();

    if ($('span#arrow').html() === '▼') {
      $('span#arrow').html('▲');
      $('div.search-area').css({'width': '100%'});
    } else {
      $('span#arrow').html('▼');
      $('div.search-area').css({'width': 'auto'});
    }
  });
  $( window ).resize(() => {
    if (Util.isMobile()) {
      $("ul").slideUp();
    } else {
      $("ul").slideDown();
    }
  });

  $("ul").slideDown();
}

Util.fetchInfo = function(place) {
  const url = `https://api.foursquare.com/v2/venues/search?client_id=${fourSquareClientId}&client_secret=${fourSquareClientSecret}&v=20130815&ll=${place.lng},${place.lat}&query=\'${place.name}\'&limit=1`;

  $.getJSON(url).done(({ response: { venues: [venue] }}) => {
    const venueName = venue.name;
    const categoryName = venue.categories[0].name;
    const location = venue.location;
    const formattedAddress = location.formattedAddress;
    place.info = `<h2>${venueName}</h2><h3>${categoryName}</h3><h4>${formattedAddress}</h4>`;
  }).fail((jqXHR, textStatus, errorThrown) => {
    console.log('getJSON request failed! ' + textStatus);
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

export default Util;