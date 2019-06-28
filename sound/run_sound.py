import pygame
import json
import time
import datetime as dt
import socket

FADEOUT_TIME = 3
NUM_CHANNELS = 12
t = time.time()

channels_ignore = [0 for i in range(0, NUM_CHANNELS)]
sounds = []
fadeout_ignore = False
cur_mode = "init"

# set up and open read from the socket
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.bind(('localhost', 8124))

exit = False

while not exit:
    print('Listening for new connection...')
    client.listen(1)
    c, addr = client.accept()
    print('Got connection from ', addr)


    pygame.mixer.init(44100, -16, channels=2, buffer=4096 )
    pygame.mixer.set_num_channels(NUM_CHANNELS)
    channels = [pygame.mixer.Channel(i) for i in range(0,NUM_CHANNELS)]  # argument must be int


    while True: # infinite while-loop
        json_msg = c.recv(65536) # receives sensor value from the socket
        print("{}:{}".format(dt.datetime.now().time(),json_msg))

        msg = json.loads(json_msg)

        if fadeout_ignore:
            if time.time()-t > FADEOUT_TIME:
                fadeout_ignore = False
                cur_mode = "init"
                channels_ignore = [False for i in range(0,NUM_CHANNELS)] #init channel ignores
            else:
                continue

        #TODO
        # mode = mdg.mode
        # NOT SURE WHY BELOW IS A FIX BUT ERRORED OTHERWISE
        mode = msg["mode"]
        if cur_mode == mode:
            if mode == "flicker":
                for i in msg.sensorsData:
                    name = int(msg.sensorsData[i].name)
                    if name in [1]:
                        if msg.sensorsData[i].fast > 40:
                            if time.time() > channels_ignore[i]:
                                channels[i].play(sounds[i])
                                channels_ignore[i] = time.time()+sounds[i].get_length()
                    if name in [0]:
                        channels[i].set_volume(msg.sensorsData[i].slow)

        else: #change of mode
            if cur_mode != "init":
                t = time.time()
                pygame.mixer.fadeout(FADEOUT_TIME)
                fadeout_ignore = True
             #init mode sounds
            else:
                if mode == "flicker":
                    # create separate Channel objects for simultaneous playback

                    sounds = [pygame.mixer.Sound("./flicker/Casio-MT-45-16-Beat.wav"),
                              pygame.mixer.Sound("./flicker/Kawai-K3-Electric-Piano-C4.wav") ]

                    # plays loop of rain sound indefinitely until stopping playback on Channel,
                    # interruption by another Sound on same Channel, or quitting pygame
                    channels[0].play(sounds[0], loops=-1)

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

