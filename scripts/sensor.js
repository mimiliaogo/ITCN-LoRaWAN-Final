var macaddr = "?macaddr=" + "aa37d395"; // the mac address of the LoRaWan device
var AccessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1NmY0NjVhZDdlZTRmMmU2MGY4YTFlODRhZmFmNTUzYzcwYTBhYTk4ZjE3ZjFiMTM1ZWJjMGMwNzcxZWJiMzQyMjAyYzJmZjlkNzBiYWVhIn0.eyJhdWQiOiIyIiwianRpIjoiNjU2ZjQ2NWFkN2VlNGYyZTYwZjhhMWU4NGFmYWY1NTNjNzBhMGFhOThmMTdmMWIxMzVlYmMwYzA3NzFlYmIzNDIyMDJjMmZmOWQ3MGJhZWEiLCJpYXQiOjE1NzYyMjAzNzQsIm5iZiI6MTU3NjIyMDM3NCwiZXhwIjoxNjA3ODQyNzc0LCJzdWIiOiIyNDMiLCJzY29wZXMiOltdfQ.EYcCD-gsNSKSK4YgTS1BhZytAlHFrQMe8v7IlzABe8Iufj1Hglt9sVe327c0s2_YqJS3WSGv3CUu2ogTtA1KzzRuGXk0a0nT3NXsNNhxrDI6KJaSPu6dEsYrUEnU2d3UbX9hHz_LwLuki_DR_L4j_olfyJ8unM-eJp4hSQNrK85Z5owWQPSlRvIWYoPyekqH5bU59KTUU4gSYMYKryQ5PMCm1hhmRe_UneGzUDD3ofiaAxV1yHMp8esjGh6pTNB5FLSqEq036H81UxTYzvXSEL0p7sQPbD7jqw7RHRwwXauVcjV42Zp-TdjYzTsACGzhj7FjoDnBxmhWWXont1IPpp1ChrIrD_W4lHub2vp1zD6lg5MROWEIDVQ3ejzMZYFu7xhqQux8Idjj30KrGt7Acvcv-hth36EG4dHJM4uLCrFW6PM2mxPWHQMvr2yd7P9MtV8ZW9DdBoJVGwoJka4XNLAbZGw55m7HXKZPEcvvlDPpmvTOHKk2DDR7uzRfXPvc8xDNfDZx4ksqMpvepuzJkBwgkVn1CZi3rsDDFgwZVWQkMEtRKlKZj4TaodiIf-iKfg-p6uP-0mn6orj0CI4LafyuFKJhLT8Si8NTNsUPYYYhfk8_87tSGWRmZb66OjcisU0NqD7TAiZzWv6RpRGHIOE3UQ3RPwvrBx7OH2F7L6M";
var sendNotificationTimeInterval = 10000;
var tempAdd = document.getElementById("temperature");
var warmAdd = document.getElementById("warm");

document.addEventListener('DOMContentLoaded', function () {
    var _adslf = setInterval(showValue, sendNotificationTimeInterval);
});
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
function showValue () {
    $.ajax({
        type: "POST",
        url: "https://campus.kits.tw/ICN_API" + macaddr + calculate_date_filter(),
        dataType: "json",
        async: false,
        success: function (response) {
//            console.log(response);
            if (response[0]['humidity'] != null) {
                warmAdd.innerHTML = "Warm is : " + response[0]['humidity'];
            }else {
                warmAdd.innerHTML = "No humidity data QQ ";
            }
            if (response[0]['temperature'] != null) {
                tempAdd.innerHTML = "Temperature is : " + response[0]['humidity'];
            }else {
                    tempAdd.innerHTML = "No temperature data QQ ";
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