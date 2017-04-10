/**
 * Created by andrewc on 4/10/2017.
 */
/**
 *
 */

const MapHelper = {};
const defaultLat = -29.83608;
const defaultLng = 30.918399;
const defaultZoomLevel = 15;

MapHelper.initializeMap = function() {
  let mapOptions = {
    zoom: defaultZoomLevel,
    center: new google.maps.LatLng(defaultLat, defaultLng),
    disableDefaultUI: true
  };
  return new google.maps.Map(document.getElementById('map'), mapOptions);
}

export default MapHelper;