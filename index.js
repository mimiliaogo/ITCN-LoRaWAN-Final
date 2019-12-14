var map;
var now_location = null ;
var AccessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1NmY0NjVhZDdlZTRmMmU2MGY4YTFlODRhZmFmNTUzYzcwYTBhYTk4ZjE3ZjFiMTM1ZWJjMGMwNzcxZWJiMzQyMjAyYzJmZjlkNzBiYWVhIn0.eyJhdWQiOiIyIiwianRpIjoiNjU2ZjQ2NWFkN2VlNGYyZTYwZjhhMWU4NGFmYWY1NTNjNzBhMGFhOThmMTdmMWIxMzVlYmMwYzA3NzFlYmIzNDIyMDJjMmZmOWQ3MGJhZWEiLCJpYXQiOjE1NzYyMjAzNzQsIm5iZiI6MTU3NjIyMDM3NCwiZXhwIjoxNjA3ODQyNzc0LCJzdWIiOiIyNDMiLCJzY29wZXMiOltdfQ.EYcCD-gsNSKSK4YgTS1BhZytAlHFrQMe8v7IlzABe8Iufj1Hglt9sVe327c0s2_YqJS3WSGv3CUu2ogTtA1KzzRuGXk0a0nT3NXsNNhxrDI6KJaSPu6dEsYrUEnU2d3UbX9hHz_LwLuki_DR_L4j_olfyJ8unM-eJp4hSQNrK85Z5owWQPSlRvIWYoPyekqH5bU59KTUU4gSYMYKryQ5PMCm1hhmRe_UneGzUDD3ofiaAxV1yHMp8esjGh6pTNB5FLSqEq036H81UxTYzvXSEL0p7sQPbD7jqw7RHRwwXauVcjV42Zp-TdjYzTsACGzhj7FjoDnBxmhWWXont1IPpp1ChrIrD_W4lHub2vp1zD6lg5MROWEIDVQ3ejzMZYFu7xhqQux8Idjj30KrGt7Acvcv-hth36EG4dHJM4uLCrFW6PM2mxPWHQMvr2yd7P9MtV8ZW9DdBoJVGwoJka4XNLAbZGw55m7HXKZPEcvvlDPpmvTOHKk2DDR7uzRfXPvc8xDNfDZx4ksqMpvepuzJkBwgkVn1CZi3rsDDFgwZVWQkMEtRKlKZj4TaodiIf-iKfg-p6uP-0mn6orj0CI4LafyuFKJhLT8Si8NTNsUPYYYhfk8_87tSGWRmZb66OjcisU0NqD7TAiZzWv6RpRGHIOE3UQ3RPwvrBx7OH2F7L6M";

$(document).ready(function() {
    $("#btn_get_bike_loc").click(function() {
        var macaddr = "?macaddr=" + "aa37d395"; // the mac address of the LoRaWan device
        
        // Calculate the data_filter(require data time range)
        // here we set the time range from a hour before to a hour later.
        var date = new Date(); // get current time
        var date_s = date.getFullYear().toString() + "-"; // date in string
        if (date.getMonth()+1 < 10) date_s += "0" + (date.getMonth()+1).toString() + "-";
        else date_s += (date.getMonth()+1).toString() + "-";
        if (date.getDate() < 10) date_s += "0" + (date.getDate()).toString() + " ";
        else date_s += (date.getDate()).toString() + " ";
        var hour_before, hour_after;
        if ((date.getHours()-1) < 10) hour_before = "0" + (date.getMonth()-1).toString();
        else hour_before = ((date.getHours()-1)).toString();
        if ((date.getHours()+1) < 10) hour_after = "0" + (date.getMonth()+1).toString();
        else hour_after = ((date.getHours()+1)).toString();
        var date_filter = "&date_filter=" + date_s + hour_before + ":00:00+-+" + date_s + hour_after + ":00:00";
        //var date_filter = "&date_filter=" + "2019-12-13 12:00:00+-+2019-12-15 11:59:00";
        //console.log(date_filter);

        var data_array;
        $.ajax({
            type: "POST",
            url: "https://campus.kits.tw/ICN_API" + macaddr + date_filter,
            dataType: "json",
            async: false,
            success: function(response) {
                console.log(response);
                console.log(response.length);
                for (var i = response.length-1; i >= 0; i--) {
                    if (response[i]['lng'] !== null && response[i]['lat'] !== null) {
                        now_location = {lat: response[i]['iat'], lng: response[i]['ing']};
                        document.getElementById("span_lng").innerHTML = response[i]['lng'];
                        document.getElementById("span_lat").innerHTML = response[i]['lat'];
                        break;
                    }
                }
                //data_array = response;
            },
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + AccessToken
            },
            error: function(jqXHR) {
                //alert("Return status: " + jqXHR.status);
                if(jqXHR.status == '200')
                    alert("API calling error: macaddr or url format error!");
                else
                    alert("API is sleeping !");
            }
        })
    })
});

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 24.7914224, lng: 120.99686399999999},
        zoom: 18
    });

}
// button function
// TODO : time delay problem for http reponse and click function
$("#btn_get_bike_loc").click(function () {
    console.log("click detected ");
    var marker = new google.maps.Marker({
        //position: now_location, 
        position: {lat: 24.7914224, lng: 120.99686399999999}, 
        title:"your bicycle"
    });
    
    // To add the marker to the map, call setMap();
    marker.setMap(map);
});

    