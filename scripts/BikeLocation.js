var map;
var panorama;
var now_location = { lat: 0, lng: 0 };
var AccessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1NmY0NjVhZDdlZTRmMmU2MGY4YTFlODRhZmFmNTUzYzcwYTBhYTk4ZjE3ZjFiMTM1ZWJjMGMwNzcxZWJiMzQyMjAyYzJmZjlkNzBiYWVhIn0.eyJhdWQiOiIyIiwianRpIjoiNjU2ZjQ2NWFkN2VlNGYyZTYwZjhhMWU4NGFmYWY1NTNjNzBhMGFhOThmMTdmMWIxMzVlYmMwYzA3NzFlYmIzNDIyMDJjMmZmOWQ3MGJhZWEiLCJpYXQiOjE1NzYyMjAzNzQsIm5iZiI6MTU3NjIyMDM3NCwiZXhwIjoxNjA3ODQyNzc0LCJzdWIiOiIyNDMiLCJzY29wZXMiOltdfQ.EYcCD-gsNSKSK4YgTS1BhZytAlHFrQMe8v7IlzABe8Iufj1Hglt9sVe327c0s2_YqJS3WSGv3CUu2ogTtA1KzzRuGXk0a0nT3NXsNNhxrDI6KJaSPu6dEsYrUEnU2d3UbX9hHz_LwLuki_DR_L4j_olfyJ8unM-eJp4hSQNrK85Z5owWQPSlRvIWYoPyekqH5bU59KTUU4gSYMYKryQ5PMCm1hhmRe_UneGzUDD3ofiaAxV1yHMp8esjGh6pTNB5FLSqEq036H81UxTYzvXSEL0p7sQPbD7jqw7RHRwwXauVcjV42Zp-TdjYzTsACGzhj7FjoDnBxmhWWXont1IPpp1ChrIrD_W4lHub2vp1zD6lg5MROWEIDVQ3ejzMZYFu7xhqQux8Idjj30KrGt7Acvcv-hth36EG4dHJM4uLCrFW6PM2mxPWHQMvr2yd7P9MtV8ZW9DdBoJVGwoJka4XNLAbZGw55m7HXKZPEcvvlDPpmvTOHKk2DDR7uzRfXPvc8xDNfDZx4ksqMpvepuzJkBwgkVn1CZi3rsDDFgwZVWQkMEtRKlKZj4TaodiIf-iKfg-p6uP-0mn6orj0CI4LafyuFKJhLT8Si8NTNsUPYYYhfk8_87tSGWRmZb66OjcisU0NqD7TAiZzWv6RpRGHIOE3UQ3RPwvrBx7OH2F7L6M";
var macaddr = "?macaddr=" + "aa37d395"; // the mac address of the LoRaWan device
var sendNotificationTimeInterval = 10000;

$(document).ready(function () {
    $("#btn_get_bike_loc").click(function () {
        var date_filter = calculate_date_filter();
        // send request
        $.ajax({
            type: "POST",
            url: "https://campus.kits.tw/ICN_API" + macaddr + date_filter,
            dataType: "json",
            async: false,
            success: function (response) {
                console.log(response);
                console.log(response.length);
                for (var i = response.length - 1; i >= 0; i--) {
                    if (response[i]['lng'] !== null && response[i]['lat'] !== null) {
                        document.getElementById("span_lng").innerHTML = response[i]['lng'];
                        document.getElementById("span_lat").innerHTML = response[i]['lat'];
                        // draw marker
                        now_location['lat'] = parseFloat(response[i]['lat']);
                        now_location['lng'] = parseFloat(response[i]['lng']);
                        
                        googleMapMarker()
                        break;
                    }
                }
                //data_array = response;
            },
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + AccessToken
            },
            error: function (jqXHR) {
                //alert("Return status: " + jqXHR.status);
                if (jqXHR.status == '200')
                    alert("API calling error: macaddr or url format error!");
                else
                    alert("API is sleeping !");
            },
        })
    })
});

function googleMapMarker() {
    var marker = new google.maps.Marker({
        position: now_location,
        title: "your bicycle",
        label: "Here",
    });
    var contentString = "your bicycle here !\n press street view to see where your bicycle in real";

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
    });

    infowindow.open(map, marker);
    // To add the marker to the map, call setMap();

    // street view 
    panorama = map.getStreetView();
    panorama.setPosition(now_location);
    panorama.setPov(/** @type {google.maps.StreetViewPov} */({
        heading: 0,
        pitch: 0
    }));


    marker.setMap(map);
}
// for street view
function toggleStreetView() {
    var toggle = panorama.getVisible();
    if (toggle == false) {
        panorama.setVisible(true);
    } else {
        panorama.setVisible(false);
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 24.7914224, lng: 120.99686399999999 },
        zoom: 18,
        streetViewControl: false
    });

}

function calculate_date_filter() {
    // Calculate the data_filter(require data time range)
    // here we set the time range from a hour before to a hour later.
    var date = new Date(); // get current time
    var date_s = date.getFullYear().toString() + "-"; // date in string
    if (date.getMonth() + 1 < 10) date_s += "0" + (date.getMonth() + 1).toString() + "-";
    else date_s += (date.getMonth() + 1).toString() + "-";
    if (date.getDate() < 10) date_s += "0" + (date.getDate()).toString() + " ";
    else date_s += (date.getDate()).toString() + " ";

    var secondWithInterval = new Date();
    var timeStringInterval ;
    secondWithInterval.setTime(date.getTime() - sendNotificationTimeInterval);
    timeStringInterval = ('0' + secondWithInterval.getHours()).slice(-2) + ':'
                    + ('0' + (secondWithInterval.getMinutes())).slice(-2) + ':'
                    + ('0' + (secondWithInterval.getSeconds())).slice(-2) ;

    var secondNow = new Date();
    var timeStringNow ;
    timeStringNow = ('0' + secondNow.getHours()).slice(-2) + ':'
                    + ('0' + (secondNow.getMinutes())).slice(-2) + ':'
                    + ('0' + (secondNow.getSeconds())).slice(-2) ;

    
    //var date_filter = "&date_filter=" + date_s + hour_before + ":00:00+-+" + date_s + hour_after + ":00:00";
    var date_filter = "&date_filter=" + date_s + timeStringInterval+ "+-+" + date_s + timeStringNow;
    //var date_filter = "&date_filter=" + "2020-01-10 23:58:00+-+2020-01-10 23:58:10";
    return date_filter;
}


// notification
// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
    var _adslf = setInterval(notify, sendNotificationTimeInterval);
});

function notify() {
    // request data
    $.ajax({
        type: "POST",
        url: "https://campus.kits.tw/ICN_API" + macaddr + calculate_date_filter(),
        dataType: "json",
        async: false,
        success: function (response) {
            console.log(response);
            if (response[0]['acc_x'] != null || 
                response[0]['acc_y'] != null ||
                response[0]['acc_z'] != null ) {
                pushNotification();
            }
        },
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + AccessToken
        },
        error: function (jqXHR) {
            //alert("Return status: " + jqXHR.status);
            if (jqXHR.status == '200')
                alert("API calling error: macaddr or url format error!");
            else
                alert("API is sleeping !");
        },
    })
}

function pushNotification () {
    // now time 
    var date = new Date(); // get current time
    var date_s = date.getFullYear().toString() + "-"; // date in string
    if (date.getMonth() + 1 < 10) date_s += "0" + (date.getMonth() + 1).toString() + "-";
    else date_s += (date.getMonth() + 1).toString() + "-";
    if (date.getDate() < 10) date_s += "0" + (date.getDate()).toString() + " ";
    else date_s += (date.getDate()).toString() + " ";

    var secondNow = new Date();
    var timeStringNow ;
    timeStringNow = ('0' + secondNow.getHours()).slice(-2) + ':'
                    + ('0' + (secondNow.getMinutes())).slice(-2) + ':'
                    + ('0' + (secondNow.getSeconds())).slice(-2) ; 
    var nowTimeString = date_s + timeStringNow;

    var notifactionOption = {
        body : "Detect bike moving at " + nowTimeString
    }

    var closeNotificationTime = 5000;
    // check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    // check if the user is okay to get some notification
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification("Vibrate!!", notifactionOption);
    }
    //  ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {

            // Whatever the user answers, we make sure we store the information
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }

            // If the user is okay, let's create a notification
            if (permission === "granted") {
                var notification = new Notification("Vibrate!!", notifactionOption);
            }
        });
    } else {
        alert(`Permission is ${Notification.permission}`);
    }
    setTimeout(function() { notification.close() }, closeNotificationTime);
}