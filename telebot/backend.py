import requests
import json
from datetime import datetime, timedelta
import threading


# define LoRaWAN api parameter
macaddr = "?macaddr=" + "aa37d395"
# date_filter = "?date_filter=2020-01-10 15:55:00 +-+ 2020-01-10 15:58:00"
# url = "https://campus.kits.tw/api/get/data/aa37d395" + date_filter
AccessToken = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1NmY0NjVhZDdlZTRmMmU2MGY4YTFlODRhZmFmNTUzYzcwYTBhYTk4ZjE3ZjFiMTM1ZWJjMGMwNzcxZWJiMzQyMjAyYzJmZjlkNzBiYWVhIn0.eyJhdWQiOiIyIiwianRpIjoiNjU2ZjQ2NWFkN2VlNGYyZTYwZjhhMWU4NGFmYWY1NTNjNzBhMGFhOThmMTdmMWIxMzVlYmMwYzA3NzFlYmIzNDIyMDJjMmZmOWQ3MGJhZWEiLCJpYXQiOjE1NzYyMjAzNzQsIm5iZiI6MTU3NjIyMDM3NCwiZXhwIjoxNjA3ODQyNzc0LCJzdWIiOiIyNDMiLCJzY29wZXMiOltdfQ.EYcCD-gsNSKSK4YgTS1BhZytAlHFrQMe8v7IlzABe8Iufj1Hglt9sVe327c0s2_YqJS3WSGv3CUu2ogTtA1KzzRuGXk0a0nT3NXsNNhxrDI6KJaSPu6dEsYrUEnU2d3UbX9hHz_LwLuki_DR_L4j_olfyJ8unM-eJp4hSQNrK85Z5owWQPSlRvIWYoPyekqH5bU59KTUU4gSYMYKryQ5PMCm1hhmRe_UneGzUDD3ofiaAxV1yHMp8esjGh6pTNB5FLSqEq036H81UxTYzvXSEL0p7sQPbD7jqw7RHRwwXauVcjV42Zp-TdjYzTsACGzhj7FjoDnBxmhWWXont1IPpp1ChrIrD_W4lHub2vp1zD6lg5MROWEIDVQ3ejzMZYFu7xhqQux8Idjj30KrGt7Acvcv-hth36EG4dHJM4uLCrFW6PM2mxPWHQMvr2yd7P9MtV8ZW9DdBoJVGwoJka4XNLAbZGw55m7HXKZPEcvvlDPpmvTOHKk2DDR7uzRfXPvc8xDNfDZx4ksqMpvepuzJkBwgkVn1CZi3rsDDFgwZVWQkMEtRKlKZj4TaodiIf-iKfg-p6uP-0mn6orj0CI4LafyuFKJhLT8Si8NTNsUPYYYhfk8_87tSGWRmZb66OjcisU0NqD7TAiZzWv6RpRGHIOE3UQ3RPwvrBx7OH2F7L6M"
# defining a params dict for the parameters to be sent to the API 
headers = {'Accept': 'application/json', 'Authorization': AccessToken}

def send_to_telebot(msg):
    r = requests.get('https://api.telegram.org/bot1039200886:AAFNdOTjoHHMvNMFq6CL3CQTYeo1KBg6oVE/sendMessage?chat_id=-1001448746136&text=' + msg)
    print(r)

def setInterval(func,time):
    e = threading.Event()
    while not e.wait(time):
        func()

def update():
    print("updating")
    x = datetime.now()
    y = x - timedelta(hours = 0, minutes = 1)
    timerange = y.strftime("%Y-%m-%d %H:%M:%S") + " +-+ " + x.strftime("%Y-%m-%d %H:%M:%S")
    url = "https://campus.kits.tw/api/get/data/aa37d395?date_filter=" + timerange
    print(timerange)

    r = requests.post(url = url, headers= headers)
    data = r.json()
    print(json.dumps(data, indent=4))
    for d in data:
        if (d['acc_x'] != None):
            print(d['acc_x'])
            send_to_telebot('Detect bike moving at ' + x.strftime("%H:%M:%S"))


setInterval(update, 60)