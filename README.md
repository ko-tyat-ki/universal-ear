# Nowhere Ear

```
Isn't he a bit like you and me?
Nowhere man, The world is at your command
```
## Introduction

You all know that we, the Ko-Tyat-Ki Kollektive, are working on this crazy
installation **EAR OF THE UNIVERSE** that will be (wooop wooop)
premiered at Nowhere 2019.

How do you create visuals for an installation you can't practically build at home?
That is correct, as a Full Stack dev, you create a web-simulation of the
real installation you can practice your code on 😆.

And then you ask all your friends to contribute!

## About the installation

The principle is:
a lot of ropes, when people touch them or pull them, the LEDs and
sound-scape changes.

How the light changes can be decided by you!

In this simulation, you can simulate pulling the ropes by
pressing keys on the keyboard, and see the results on the web page.

![Structure Render](/images/structure_render.png)

## Your contribution!

We worked very hard to make a potential contribution as easy as possible.
All the visualisation, simulation is there, but we need your ideas on how
to transform sensor data into lit LEDs.

This is basically to create a bit of a transformation code in between.

We did come up with several examples that represent what potantially can be done.
We hope they will be helpful, but please feel free to go wild.

When we recieve all the beautiful ideas, we will select the best, and figure out the
way to present them (e.g. one stick per idea? or one hour gig for each idea?)

And your idea and your name will be on Playa making all of nobodies super happy.

_(more details and explanations on where and how exactly to fill your idea in below)_

## Pre-requirements

Very basic knowledge of any coding and github should be enough.

Technical prerequisites: [github account](https://help.github.com/en/articles/connecting-to-github-with-ssh), computer with installed and [set up git](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup), [node and npm](https://www.npmjs.com/get-npm) (we use node 10).

## As a start
```
git clone git@github.com:ko-tyat-ki/nowhere-ear.git
cd nowhere-ear
npm install
npm start
```

This will start node server that will restart when you change the code.
Code can be written using es2015 syntax on server and on client.

When starting the server you might notice some warnings in the console, e.g.
```
Warning: the port /dev/tty/.usbmodem14201 failed to open, did you connect the device? If not - no worries, client side can work without it
```
Do not worry, this is for us to monitor the real devices we sometimes connect. The simulation can work without them.


#### To see the results
Navigate to http://localhost:3000 in your browser and enjoy the visualisation:

![Screen print](/images/screen.png)

You can see three *structure types*: "Duet", "Circle" and "Realistic".
"Realistic" is the main one that is very similar to our latest plans for the real thing. Scaffolding position are close to what we are planning in reality. LEDs position are indicative, and might change - so this is mainly for you to have an idea / rough understanding how it is going to look. It will look much cooler with sensors highlighting fluorescent ropes and stuff (hopefully).

To "trigger" the sensor you can use keys "a" and "s" for "Duet", and
"1","2","3","4","5","6","7","8","9","0" for "Circle" and "Realistic".

We did simulate two types of interaction - very fast one, similar to abruptly pulling
the rope (keep the key on for a short period of time), and smooth one (keep key for a bit longer).

You can already choose several visual *modes* - functions that transform sensor data into lit leds. These are very basic examples of what potentially can be done (more about this below).

## How to contribute

### How can you add a new visualisation
1. Create a new branch with a name for example `[your-name]-[mode-name]` e.g. `katya-supermegacoolmode`

```
git checkout -b [your-name]-[mode-name]
```

2. Go to the folder `./web/lib/modes/`. This is where all visual modes live. Create a js file where your code will live (the easiest might be by copying one of the existing ones?).

3. Import it into `./web/lib/visualisations.js` by adding

```js
import [yourMode] from './modes/[yourMode]'
```

and the name of it to export.

4. Add a new mode under the same name `./static/index.html` under `<h5>mode:</h5>`

```html
<option value="yourMode">How you want to show your mode</option>
```

5. When you are happy with what you've done, create a Pull Request, and tag some of us.

### A bit more about modes

Modes function accepts `(sticks, sensors)`.

From sticks you can use properties that are set on config, such as
- `name`
- `numberOfLEDs`
- inital coordinates (y is vertical)
```js
init : {
    x: ...,
    y: ...,
    z: ...
}
```
Senors have
 - `tension` - the tension that depends on key press. There are two distinct tension modes,
 -- if the user releases the key after less than 0.5s pressing, the sensor gets quickly to the highest value and back
 -- if the user continues pressing the key after 0.5s, the sensor value slowly increases, and slowly decreases after the button is released
 - `oldTension` - an array of tension history (four values slowly following the current tension value: [0] the furthest away from tension value, [3] the closest value)
 - `stick` - which column (stick) it is attached to
 - `position` - where on the stick it is attached to; as a number of the LED

The function should return array of arrays, where every entry has
- `key` - name of the stick you want to light up
- array of `leds`.

Every led has its `number` (integer, from `0` to `numberOfLEDs-1`) and color
```js
color : {
    r: ...,
    g: ...,
    b: ...
}
```

Everything else is up to your imagination.

## A bit more about existing examples

### Basic

Simply reacts to sensor tension proportionate to tension. Very basic.

![duet-basic-small](/images/duet-basic-small.gif)

### Fast reaction

Reacts only to fast pull and does not to slow one.

![fast-duet-small](/images/fast-duet-small.gif)

### Flicker

Flickers the stick when you activate the sensor attahced to it.

![flicker-real-small](/images/flicker-real-small.gif)

### Random echo

The active stick is the brightest, all the rest are less bright proportinate to the distance.

![random-echo-circle-small](/images/random-echo-circle-small.gif)

### Tension with echo

When tension reached the end of the stick, its echo goes to all other sticks.

![tension-random-real-small](/images/tension-random-real-small.gif)

## Support and questions

Any questions, suggestions, love notes - write them either to Katya or Ivan immediately via
any known source of commmunication, or submit a github issue.

## API

### Switch mode

Path: `/mode`
Method: `POST`
Headers: `Content-Type: application/json`
Body Example:
```
{
  "method": "flicker"
}
```

Available modes:
```
basic
basic_with_rainbow
changing_colors
fastReaction
flicker
rain
rainEffect
random_flashes
randomEcho
tensionWithEcho
workshop
```
