/**
 * Created by andrewc on 4/10/2017.
 */
const Util = {};
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

export default Util;