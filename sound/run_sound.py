import pygame
import random
import time
import socket

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

    # create separate Channel objects for simultaneous playback
    channel1 = pygame.mixer.Channel(0) # argument must be int
    channel2 = pygame.mixer.Channel(1)

    sound1 = pygame.mixer.Sound("./flicker/Casio-MT-45-16-Beat.wav")
    sound2 = pygame.mixer.Sound("./flicker/Kawai-K3-Electric-Piano-C4.wav")

    # plays loop of rain sound indefinitely until stopping playback on Channel,
    # interruption by another Sound on same Channel, or quitting pygame
    channel1.play(sound1, loops = -1)

    # plays occasional thunder sounds
    duration = sound2.get_length() # duration of thunder in seconds
    down = True

    while True: # infinite while-loop
        # play thunder sound if random condition met

        i = c.recv(4096) # receives sensor value from the socket
        print(i)

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

