# Nowhere Ear

```
Isn't he a bit like you and me?
Nowhere man, The world is at your command
```
# Introduction

This project is made to simplify creation of visuals for Ko-Tyat-Ki 
installation **EAR OF THE UNIVERSE** at Nowhere 2019. We would like to 
invite our friends and interested people to create something 
that will be visible on the Playa this July.
![Structure Render](/images/structure_render.png)

The principle is:
a lot of ropes, when people touch them or pull them, the LEDs and
sound-scape changes. How the light changes is to be decided by you!
In this project, you can simulate pulling the ropes by 
pressing keys and control the outputs.

## Basic requirements

Github, node-js, npm, babel, 

## Basic operations

#### To run development server:

```
npm start
```

This will start node server that will restart when you change the code.
Code can be written using es2015 syntax on server and on client.

#### To see the results
Navigate to http://localhost:3000 in your browser and enjoy the visualisation:
![Screen print](/images/screen.png)

You can see three *structure types*: "Duet", "Circle" and "Realistic".
"Realistic" is the main one (with keyboard keys "1-0" representing pulling different ropes, 
although you can do simple tests in "Duet" by pressing "a" or "s".

You can already choose several *regimes*: "basic", "flicker" etc. This can be chosen to test experiences,
we encourage you to create new ones!

# To add new visualisations.
Visualisation scripts (.js) can be found under /web/lib/modes/. We ask to add new modes there. 
After creating new visualisation, add it into web/lib/visualisations.js

# Support and questions
Questions can be forwarded to Katerina or Ivan
katerina@ft.com
ivan.isakov@gmail.com