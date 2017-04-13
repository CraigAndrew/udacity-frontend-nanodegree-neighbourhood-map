const MapHelper = {};

import $ from 'jquery';
import Util from './util';

const defaultLat = -29.831808;
const defaultLng = 30.924656000000027;
const defaultZoomLevel = 15;
const bottomOffSet = 0;
const leftOffSet = -100;
let map;

/**
 * Initializes Google Map instance
 * @returns {google.maps.Map}
 */
MapHelper.initializeMap = function() {
  let mapOptions = {
    center: new google.maps.LatLng(defaultLat, defaultLng),
    disableDefaultUI: true,
    gestureHandling: 'cooperative',
    mapTypeId: 'roadmap',
    zoom: defaultZoomLevel,
    zoomControl: true
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  if (map) {
    return map;
  } else {
    alert('Google failed to load');
  }
};

/**
 * Centralizes map to marker
 * @param position
 */
MapHelper.panAndZoomToPosition = function(position) {
  map.setCenter(position);
  map.setZoom(defaultZoomLevel);

  if (Util.isMobile()) { // if mobile pan to marker where marker is vertically bottom of screen
    const divHeightOfTheMap = $('#map').outerHeight();
    map.panBy(leftOffSet, -((0.5 * divHeightOfTheMap) - bottomOffSet));
  } else { // if desktop pan to marker - just center map to marker
    map.panTo(new google.maps.LatLng(defaultLat, defaultLng));
  }
};

/**
 * Centralizes map to default position and zooms map to default zoom level
 */
MapHelper.panAndZoomToDefaultPosition = function() {
  MapHelper.panAndZoomToPosition(new google.maps.LatLng(defaultLat, defaultLng));
};

/**
 * Displays infoWindow of active marker
 * @param marker
 * @param info
 */
MapHelper.openInfoWindowForActiveMarker = function(marker, info) {
  marker.infoWindow.setContent(info);
  marker.infoWindow.open(map, marker);
};

/**
 * Creates map marker for place
 * @param place
 */
MapHelper.createMarker = function(place) {
  place.marker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    icon: place.icon,
    map,
    name: place.name,
    position: new google.maps.LatLng(place.lng, place.lat)
  });
};

export default MapHelper;