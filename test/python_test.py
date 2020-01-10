from datetime import datetime, timedelta

x = datetime.now()
y = x - timedelta(hours = 0, minutes = 10)

print(x.strftime("%Y-%m-%d %H:%M:%S"))
print(y.strftime("%Y-%m-%d %H:%M:%S"))
print(y.strftime("%Y-%m-%d %H:%M:%S") + " +-+ " + x.strftime("%Y-%m-%d %H:%M:%S"))