import pygame
import json
import time
import datetime as dt
import random
import socket
import os
import logging

### CONSTANTS

modeNames = ["basic_with_rainbow","changing_colors","random_flashes","flicker","tensionWithEcho","jasmine","ocean","risingStairs","polzynki","sleep","easterEgg"]
sound_groups = {"basic_with_rainbow":["basic_with_rainbow","tensionWithEcho"],
                'flicker':["flicker"],
                'ocean':["ocean","random_flashes"],
                'polzynki':["risingStairs","polzynki"],
                'jasmine':["jasmine","changing_colors"],
                'sleep':['sleep'],
                'easterEgg':['easterEgg']}
NUM_CHANNELS = 5
NUM_LEDS = 40

### CONSTANTS

inv_sound_groups = {}
for key in sound_groups.keys():
    for val in sound_groups[key]:
        if val in inv_sound_groups.keys():
            logging.warning('mode {} is in multiple sound groups!'.format(val))
        else:
            inv_sound_groups[val] = key


t = time.time()
logging.basicConfig(format='%(asctime)s %(message)s', level=logging.INFO)

logging.info("Initialisation for {} channels".format(NUM_CHANNELS))

channels_ignore = [0 for i in range(0, NUM_CHANNELS)]
sounds = []
fadeout_ignore = False
cur_mode = "init"

cur_dir = (os.path.dirname(os.path.abspath(__file__)))

config_path = os.path.join(cur_dir, os.pardir, 'modes_config.json')
logging.info("Loading config from {}".format(config_path))
with open(config_path) as json_file:
    config = json.load(json_file)

FADEOUT_TIME = config['generalSoundConfig']['timeout']

logging.info("Trying to connect...")

# set up and open read from the socket
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
while True:
    try:
        client.bind(('localhost', 8124))
        break
    except:
        logging.warning("Can't bind to 8124. Retry")
        time.sleep(1)

logging.info("Initialising mixer")

# init mixer
pygame.mixer.init(44100, -16, channels=2, buffer=4096)
pygame.mixer.set_num_channels(NUM_CHANNELS)
channels = [pygame.mixer.Channel(i) for i in range(0, NUM_CHANNELS)]  # argument must be int

exit = False

while not exit:
    try:
        logging.info('Listening for new connection...')
        client.listen(1)
        c, addr = client.accept()
        logging.info('Got connection from {}'.format(addr))

        while True: # infinite while-loop
            json_msg = c.recv(4096) # receives sensor value from the socket
            # drain buffer
            if len(json_msg) == 4096 or json_msg[:7] != b'{"mode"':
                continue
            #if two messages made it only take first
            msg_point = json_msg.find(b'}{"mode"')
            if msg_point != -1:
                json_msg = json_msg[:msg_point+1]

            logging.debug("{}:{}".format(dt.datetime.now().time(),json_msg))

            msg = json.loads(json_msg)

            if fadeout_ignore:
                if time.time()-t > FADEOUT_TIME:
                    logging.info('Fadeout complete')
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

                    try:
                        if mode in inv_sound_groups.keys():
                            #Flicker
                            if inv_sound_groups[mode] == "flicker":
                                max_range = NUM_LEDS*config['flickerConfig']['factor']
                                # if name in [7, 8]:
                                #     slow = sensor['slow']
                                #     if slow > max_range*config['flickerConfig']['slowSoundTrigger']:
                                #         if time.time() > channels_ignore[name]:
                                #             channels[name].play(sounds[name])
                                #             channels_ignore[name] = time.time()+sounds[name].get_length()
                                #     if slow < 0:
                                #         slow = 0
                                #     if slow > max_range:
                                #         slow = max_range
                                #     channels[name].set_volume((slow / max_range)*config['flickerConfig']['soundFactor'])
                                # else:
                                if sensor['fast'] > max_range*config['flickerConfig']['soundTrigger']:
                                    if time.time() > channels_ignore[name]:
                                        channels[name].set_volume(config['flickerConfig']['soundFactor'])
                                        channels[name].play(sounds[name])
                                        channels_ignore[name] = time.time()+sounds[name].get_length()
                            #Polzynki
                            elif inv_sound_groups[mode] == "polzynki":
                                max_range = NUM_LEDS*config['polzynkiConfig']['factor']

                                # if name in [5,7,8,10]:
                                #     slow = sensor['slow']
                                #     if slow > max_range*config['polzynkiConfig']['slowSoundTrigger']:
                                #         if time.time() > channels_ignore[name]:
                                #             channels[name].play(sounds[name])
                                #             channels_ignore[name] = time.time()+sounds[name].get_length()
                                #     if slow < 0:
                                #         slow = 0
                                #     if slow > max_range:
                                #         slow = max_range
                                #     channels[name].set_volume((slow / max_range)*config['polzynkiConfig']['soundFactor'])
                                # else:
                                if sensor['fast'] > max_range*config['polzynkiConfig']['soundTrigger']:
                                    if time.time() > channels_ignore[name]:
                                        channels[name].set_volume(config['polzynkiConfig']['soundFactor'])
                                        channels[name].play(sounds[name])
                                        channels_ignore[name] = time.time()+sounds[name].get_length()
                            #Ocean
                            elif inv_sound_groups[mode] == "ocean":
                                max_range = NUM_LEDS*config['oceanConfig']['factor']

                                # if name in [3,4,5,7,8]:
                                #     slow = sensor['slow']
                                #     if slow > max_range*config['oceanConfig']['slowSoundTrigger']:
                                #         if time.time() > channels_ignore[name]:
                                #             channels[name].play(sounds[name])
                                #             channels_ignore[name] = time.time()+sounds[name].get_length()
                                #     if slow < 0:
                                #         slow = 0
                                #     if slow > max_range:
                                #         slow = max_range
                                #     channels[name].set_volume((slow / max_range)*config['oceanConfig']['soundFactor'])
                                # else:
                                if sensor['fast'] > config['oceanConfig']['tensionTrigger']:
                                    if time.time() > channels_ignore[name]:
                                        loc = random.uniform(0.65, 0.85)
                                        if sensor['where'] == 'right':
                                            channels[name].set_volume((1 - loc) * config['oceanConfig']['soundFactor'],loc * config['oceanConfig']['soundFactor'])
                                        else:
                                            channels[name].set_volume(loc * config['oceanConfig']['soundFactor'], (1 - loc) * config['oceanConfig']['soundFactor'])
                                        channels[name].play(sounds[name])
                                        channels_ignore[name] = time.time() + sounds[name].get_length()
                            #Basic
                            elif inv_sound_groups[mode] == "basic_with_rainbow":
                                max_range = config['basicWithRainbow']['maxTension']

                                # if name in [2,4,5,7,8,11]:
                                #     slow = sensor['slow']
                                #     if slow > max_range*config['basicWithRainbow']['slowSoundTrigger']:
                                #         if time.time() > channels_ignore[name]:
                                #             channels[name].play(sounds[name])
                                #             channels_ignore[name] = time.time()+sounds[name].get_length()
                                #     if slow < 0:
                                #         slow = 0
                                #     if slow > max_range:
                                #         slow = max_range
                                #     channels[name].set_volume((slow / max_range)*config['basicWithRainbow']['soundFactor'])
                                # else:
                                if sensor['fast'] > max_range*config['basicWithRainbow']['soundTrigger']:
                                    if time.time() > channels_ignore[name]:
                                        loc = random.uniform(0.55, 0.95)
                                        if sensor['where'] == 'right':
                                            channels[name].set_volume((1 - loc) * config['basicWithRainbow']['soundFactor'],loc * config['basicWithRainbow']['soundFactor'])
                                        else:
                                            channels[name].set_volume(loc * config['basicWithRainbow']['soundFactor'], (1 - loc) * config['basicWithRainbow']['soundFactor'])
                                        channels[name].play(sounds[name])
                                        channels_ignore[name] = time.time() + sounds[name].get_length()
                            #Jasmine
                            elif inv_sound_groups[mode] == "jasmine":
                                if sensor['fast'] > config['jasmineConfig']['tensionTrigger']:
                                    if time.time() > channels_ignore[name]:
                                        loc = random.uniform(0.55,0.95)
                                        if sensor['where'] == 'right':
                                            channels[name].set_volume((1-loc)*config['jasmineConfig']['soundFactor'],loc*config['jasmineConfig']['soundFactor'])
                                        else:
                                            channels[name].set_volume(loc*config['jasmineConfig']['soundFactor'],(1-loc)*config['jasmineConfig']['soundFactor'])
                                        channels[name].play(sounds[name])
                                        channels_ignore[name] = time.time()+sounds[name].get_length()
                    except Exception as e:
                        logging.warning('Problem playing sound - {}'.format(e))
                        pass


            else: #change of mode
                logging.info("Change of mode from {} to {}".format(cur_mode,mode))

                if not mode in inv_sound_groups.keys():
                    logging.warning("Unknown mode - {}".format(mode))

                    # play Sleep sound
                    try:
                        base_sound_path = os.path.join(cur_dir, 'sleep', 'Base.mp3')
                        pygame.mixer.music.load(base_sound_path)
                        logging.info("Finished loading base from {}".format(base_sound_path))
                    except:
                        logging.warning("Base sound not found at {}, loading default".format(base_sound_path))
                        pygame.mixer.music.load(os.path.join(cur_dir, 'system', 'Base.mp3'))
                    pygame.mixer.music.play(loops=-1)
                    pygame.mixer.music.set_volume(config['sleepConfig']['volume'])
                elif mode == "easterEgg":
                    logging.info("Easter Egg!")
                    # UNCOMMENT FOR REAL EASTER EGG :)
                    pygame.mixer.stop()

                    pygame.mixer.music.stop()
                    try:
                        pygame.mixer.music.load(os.path.join(cur_dir, 'easterEgg', 'Base.mp3'))
                    except:
                        pygame.mixer.music.load(os.path.join(cur_dir, 'system', 'Base.mp3'))
                    pygame.mixer.music.play(loops=1)
                    pygame.mixer.music.set_volume(config['easterEggConfig']['volume'])
                    cur_mode = mode
                elif cur_mode != "init":
                    if inv_sound_groups[mode] == inv_sound_groups[cur_mode]:
                        logging.info("Change to mode from the same group {}".format(inv_sound_groups[mode]))
                        cur_mode = mode
                    else:
                        #start Fadeout
                        logging.info("Start Fadeout")
                        t = time.time()
                        pygame.mixer.fadeout(FADEOUT_TIME * 1000)
                        pygame.mixer.music.fadeout(FADEOUT_TIME * 1000)
                        fadeout_ignore = True
                elif mode == "sleep":
                    logging.info("Loading Sleep")

                    # play Base sound
                    try:
                        base_sound_path = os.path.join(cur_dir, 'sleep', 'Base.mp3')
                        pygame.mixer.music.load(base_sound_path)
                        logging.info("Finished loading base from {}".format(base_sound_path))
                    except:
                        logging.warning("Base sound not found at {}, loading default".format(base_sound_path))
                        pygame.mixer.music.load(os.path.join(cur_dir, 'system', 'Base.mp3'))
                    pygame.mixer.music.play(loops=-1)
                    pygame.mixer.music.set_volume(config['sleepConfig']['volume'])
                    cur_mode = mode
                else:
                    logging.info("Loading {}".format(mode))
                    cur_mode = mode

                    sound_path = os.path.join(cur_dir, inv_sound_groups[mode])

                    #load sounds
                    sounds = []
                    for i in range(0,NUM_CHANNELS):
                        try:
                            sounds.append(pygame.mixer.Sound(os.path.join(sound_path,str(i)+'.ogg')))
                        except:
                            logging.warning("Sound {} not found, loading default".format(os.path.join(sound_path,str(i)+'.ogg')))
                            sounds.append(pygame.mixer.Sound(os.path.join(cur_dir, 'system','empty.ogg')))
                        finally:
                            channels[i].set_volume(1)

                    #load base sound
                    try:
                        base_sound_path = os.path.join(sound_path, 'Base.mp3')
                        pygame.mixer.music.load(base_sound_path)
                        logging.info("Finished loading base sound from {}".format(base_sound_path))
                    except:
                        logging.warning("Base sound not found at {}, loading default".format(base_sound_path))
                        pygame.mixer.music.load(os.path.join(cur_dir, 'system', 'Base.mp3'))
                    pygame.mixer.music.play(loops=-1)
                    pygame.mixer.music.set_volume(config['generalSoundConfig']['baseVolume'])

                    logging.info("Finished loading {}".format(mode))

    except Exception as e:
        logging.exception("Exception: {}".format(e))
        pass


