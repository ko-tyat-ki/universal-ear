import pygame
import json
import time
import datetime as dt
import random
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
    try:
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

            mode = msg['mode']
            if cur_mode == mode:
                for sensor in msg['sensorsData']:
                    try:
                        name = int(sensor['LEDShtuka']) - 1
                    except:
                        continue
                    if name not in range(0,NUM_CHANNELS):
                        continue

                    if mode == "flicker":
                        if sensor['fast'] > TRIGGER_LED_VALUE:
                            if time.time() > channels_ignore[name]:
                                channels[name].play(sounds[name])
                                channels_ignore[name] = time.time()+sounds[name].get_length()
                        if name in [10, 11]:
                            slow = sensor['slow']
                            if slow < 0:
                                slow = 0
                            if slow > MAX_LED_VALUE:
                                slow = MAX_LED_VALUE
                            channels[name].set_volume(slow / MAX_LED_VALUE)
                    elif mode == "jasmine":
                        if sensor['fast'] > TRIGGER_LED_VALUE:
                            if time.time() > channels_ignore[name]:
                                loc = random.uniform(0.55,0.95)
                                if sensor['where'] == 'right':
                                    channels[name].set_volume(1-loc,loc)
                                else:
                                    channels[name].set_volume(loc,1-loc)
                                channels[name].play(sounds[name])
                                channels_ignore[name] = time.time()+sounds[name].get_length()


            else: #change of mode
                if cur_mode != "init":
                    t = time.time()
                    pygame.mixer.fadeout(FADEOUT_TIME * 1000)
                    pygame.mixer.music.fadeout(FADEOUT_TIME*1000)
                    fadeout_ignore = True
                 #init mode sounds
                else:
                    if mode in ["flicker","jasmine"]:
                        # create separate Channel objects for simultaneous playback

                        sounds = []

                        for i in range(0,NUM_CHANNELS):
                            try:
                                sounds.append(pygame.mixer.Sound(os.path.join(cur_dir, mode,str(i)+'.ogg')))
                            except:
                                sounds.append(pygame.mixer.Sound(os.path.join(cur_dir, 'system','empty.ogg')))
                            finally:
                                channels[i].set_volume(1)

                        # play Base sound
                        try:
                            pygame.mixer.music.load(os.path.join(cur_dir, mode,'Base.mp3'))
                        except:
                            pygame.mixer.music.load(os.path.join(cur_dir, 'system', 'Base.mp3'))
                        pygame.mixer.music.play(loops=-1)

                        cur_mode = mode

    except Exception as e:
        print("Exception: {}".format(e))
        pass


