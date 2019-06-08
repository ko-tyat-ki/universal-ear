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

## Requirements

To contribute to the visualisation creations very basic knowledge of coding
and github should be enough.

Technical prerequisites: [github account](https://help.github.com/en/articles/connecting-to-github-with-ssh), computer with installed and set up git,
node and npm (we use node 11).

## How to run
```
git clone git@github.com:ko-tyat-ki/nowhere-ear.git
cd nowhere-ear
npm install
npm start
```

This will start node server that will restart when you change the code.
Code can be written using es2015 syntax on server and on client.

#### To see the results
Navigate to http://localhost:3000 in your browser and enjoy the visualisation:
![Screen print](/images/screen.png)

You can see three *structure types*: "Duet", "Circle" and "Realistic".
"Realistic" is the main one (with keyboard keys "1-0" representing pulling different ropes, 
although you can do simple tests in "Duet" by pressing "a" or "s".)

You can already choose several *regimes*: "basic", "flicker" etc. This sre for now just
very basic examples of what can be done, and this is exactly where we need the input from
your brilliant heads!
We encourage you to create new ones!

## How can you add a new visualisation
1. Create a new branch with a name `[your-name]-[mode-name]`
2. Create a new js file with the new mode name in the folder `./web/lib/modes/` (the easiest might be by copying one of the existing ones?).
3. Import it into `./web/lib/visualisations.js` by adding

```js
import [yourMode] from './modes/[yourMode].js'
```

and the name of it to export.

4. Add a new regime under the same name `./static/index.html` under `<h5>Regime:</h5>`

```html
<option value="yourMode">How you want to show your mode</option>
```

# Support and questions

Any questions, suggestions, love notes - write them either to Katya or Ivan immediately via 
any known source of commmunication, or submit a github issue.

