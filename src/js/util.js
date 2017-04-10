/**
 * Created by andrewc on 4/10/2017.
 */
const Util = {};
import $ from 'jquery';
const bounceTwiceAnimation = 4;

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

export default Util;