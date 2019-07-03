import pygame
import json
import time
import datetime as dt
import socket
import os

FADEOUT_TIME = 5
NUM_CHANNELS = 12
MAX_LED_VALUE = 40
TRIGGER_LED_VALUE = 30
t = time.time()

channels_ignore = [0 for i in range(0, NUM_CHANNELS)]
sounds = []
fadeout_ignore = False
cur_mode = "init"

cur_dir = (os.path.dirname(os.path.abspath(__file__)))

# set up and open read from the socket
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
while True:
    try:
        client.bind(('localhost', 8124))
        break
    except:
        print("Can't bind to 8124. Retry")
        time.sleep(1)

# init mixer
pygame.mixer.init(44100, -16, channels=2, buffer=4096)
pygame.mixer.set_num_channels(NUM_CHANNELS)
channels = [pygame.mixer.Channel(i) for i in range(0, NUM_CHANNELS)]  # argument must be int

exit = False

while not exit:
    print('Listening for new connection...')
    client.listen(1)
    c, addr = client.accept()
    print('Got connection from ', addr)

    while True: # infinite while-loop
        json_msg = c.recv(4096) # receives sensor value from the socket
        # drain buffer
        if len(json_msg) == 4096 or json_msg[:7] != b'{"mode"':
            continue
        #if two messages made it only take first
        msg_point = json_msg.find(b'}{"mode"')
        if msg_point != -1:
            json_msg = json_msg[:msg_point+1]

        #print("{}:{}".format(dt.datetime.now().time(),json_msg))

        msg = json.loads(json_msg)

        if fadeout_ignore:
            if time.time()-t > FADEOUT_TIME:
                fadeout_ignore = False
                cur_mode = "init"
                channels_ignore = [False for i in range(0,NUM_CHANNELS)] #init channel ignores
            else:
                continue

        #TODO
        mode = msg['mode']
        if cur_mode == mode:
            if mode == "flicker":
                for sensor in msg['sensorsData']:
                    try:
                        name = int(sensor['LEDShtuka'])
                    except:
                        continue
                    if name in range(1,7):
                        if sensor['fast'] > TRIGGER_LED_VALUE:
                            if time.time() > channels_ignore[name-1]:
                                channels[name-1].play(sounds[name-1])
                                channels_ignore[name-1] = time.time()+sounds[name-1].get_length()
                    # if name in [0,2,3,5,6,9,10,11]:
                    #     slow = sensor['slow']
                    #     if slow < 0:
                    #         slow = 0
                    #     if slow > MAX_LED_VALUE:
                    #         slow = MAX_LED_VALUE
                    #     channels[name].set_volume(slow/MAX_LED_VALUE)

        else: #change of mode
            if cur_mode != "init":
                t = time.time()
                pygame.mixer.fadeout(FADEOUT_TIME*1000)
                fadeout_ignore = True
             #init mode sounds
            else:
                if mode == "flicker":
                    # create separate Channel objects for simultaneous playback


                    sounds = [pygame.mixer.Sound(os.path.join(cur_dir, 'flicker',str(x)+'.ogg')) for x in range(1, 7)]


                    # play Base sound
                    pygame.mixer.music.load(os.path.join(cur_dir, 'flicker','Base.mp3'))
                    pygame.mixer.music.play(loops=-1)

                    for i in range(1,7):
                        channels[i].set_volume(1)

                    cur_mode = "flicker"

                    # if i > 100:
        # 	channel2.play(sound2)
        # 	channel2.set_volume(random.random(),random.random())
        # 	print('My duration', duration)
        # 	time.sleep(duration)

        # time.sleep(0.1)
        # if down:
        # 	sound1.set_volume(sound1.get_volume() - 0.01)
        # 	if sound1.get_volume() <= 0.5:
        # 		down = False
        # else:
        # 	sound1.set_volume(sound1.get_volume() + 0.01)
        # 	if sound1.get_volume() >= 1:
        # 		down = True

