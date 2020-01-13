import requests, sys
import threading
def BikeNotify():
    r = requests.get('https://api.telegram.org/bot1039200886:AAFNdOTjoHHMvNMFq6CL3CQTYeo1KBg6oVE/sendMessage?chat_id=-1001448746136&text=HelloWorld')
    
    print(r)



class ThreadJob(threading.Thread):
    def __init__(self,callback,event,interval):
        '''runs the callback function after interval seconds

        :param callback:  callback function to invoke
        :param event: external event for controlling the update operation
        :param interval: time in seconds after which are required to fire the callback
        :type callback: function
        :type interval: int
        '''
        self.callback = callback
        self.event = event
        self.interval = interval
        super(ThreadJob,self).__init__()

    def run(self):
        while not self.event.wait(self.interval):
            self.callback()



event = threading.Event()

k = ThreadJob(BikeNotify,event,10)
k.start()

print ("It is non-blocking")

# main