import math

leds = []
for i in range(40):
    leds.append([str(i), str(i), "0", "0"])


idx = 0
dataLength = 17

for writeNum in range(math.ceil(len(leds) / dataLength)):
    out = "l"
    for i in range(dataLength):
        index = i + dataLength * idx
        # print(index)
        if len(leds) <= index:
            break

        out += ";".join(leds[index])+";"
    print(out)
    idx += 1
    out = ""



# out = 'l' + ";".join(leds)+";"
# print(out)
# print(len(out))
