const MapHelper = {};
const defaultLat = -29.831808;
const defaultLng = 30.924656000000027;
const defaultZoomLevel = 15;
let map;

/**
 * Initializes Google Map instance
 * @returns {google.maps.Map}
 */
MapHelper.initializeMap = function() {
  let mapOptions = {
    zoom: defaultZoomLevel,
    center: new google.maps.LatLng(defaultLat, defaultLng),
    disableDefaultUI: true,
    mapTypeId: 'roadmap',
    gestureHandling: 'cooperative',
    fullscreenControl: true
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  if (map) {
    return map;
  } else {
    alert('Google failed to load');
  }
}

/**
 * Centralizes map to marker
 * @param marker
 */
MapHelper.panToMarker = function(marker) {
  map.panTo(marker.getPosition());
}

/**
 * Centralizes map to default position and zooms map to default zoom level
 */
MapHelper.panAndZoomToDefaultPosition = function() {
  map.panTo(new google.maps.LatLng(defaultLat, defaultLng));
  map.setZoom(defaultZoomLevel);
}

/**
 * Displays infoWindow of active marker
 * @param marker
 * @param info
 */
MapHelper.openInfoWindowForActiveMarker = function(marker, info) {
  marker.infoWindow.setContent(info);
  marker.infoWindow.open(map, marker);
}

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
}

export default MapHelper;