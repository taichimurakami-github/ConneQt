// function initMap() {
//   // The map, centered on Central Park
//   const center = {lat: 40.774102, lng: -73.971734};
//   const options = {zoom: 15, scaleControl: true, center: center};
//   map = new google.maps.Map(
//       document.getElementById('map'), options);
//   // Locations of landmarks
//   const dakota = {lat: 40.7767644, lng: -73.9761399};
//   const frick = {lat: 40.771209, lng: -73.9673991};
//   // The markers for The Dakota and The Frick Collection
//   var mk1 = new google.maps.Marker({position: dakota, map: map});
//   var mk2 = new google.maps.Marker({position: frick, map: map});
// }

// function haversine_distance(mk1, mk2) {
//     var R = 3958.8; // Radius of the Earth in miles
//     var rlat1 = mk1.position.lat() * (Math.PI/180);
//     // Convert degrees to radians
//     var rlat2 = mk2.position.lat() * (Math.PI/180);
//     // Convert degrees to radians
//     var difflat = rlat2-rlat1; // Radian difference (latitudes)
//     var difflon = (mk2.position.lng()-mk1.position.lng()) 
//                 * (Math.PI/180); // Radian difference (longitudes)

//     var d = 2 * R 
//     * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)
//     +Math.cos(rlat1)*Math.cos(rlat2)
//     *Math.sin(difflon/2)*Math.sin(difflon/2)));
//     return d;
// }


function calcKmDistance(lat1, lng1, lat2, lng2) {
    const R = Math.PI / 180;

    lat1 *= R;
    lng1 *= R;
    lat2 *= R;
    lng2 *= R;

    return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
}

module.exports = calcKmDistance;