var map;
            
var btn_center = document.getElementById("center");
    btn_center.onclick = function() {
    btn_center.style.backgroundColor="red";
    map.center.lat=24.7914224;
    map.center.lng=120.99686399999999;
}


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 24.7914224, lng: 120.99686399999999},
        zoom: 18
    });
}

document.addEventListener();