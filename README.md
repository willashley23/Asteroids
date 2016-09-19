![asteroids](https://github.com/willashley23/Asteroids/blob/master/images/screenshot1.png)

*Live link - www.willashley.io/Asteroids/*

**NOTE** –  Due to Firefox's poor handling of HTML5 Canvas, it is strongly recommended that you play the game in Chrome.

## Background

My recreation of the classic Atari game utilizes vanillia JavaScript and DOM manipulation along with the Canvas API to simulate a retro gaming experience. 

## Screenshot

![screenshots](https://github.com/willashley23/Asteroids/blob/master/images/screenshot2.png)

## Structure and Technologies

The project utilizes the following technologies: 

- Vanillia JavaScript for game logic, including collision detection, win/loss conditions/ distribution of powerups and DOM manipulation.
- Canvas will be used to render images of asteroids, ships, and powerups on the screen, however, their hitboxes will be measured and handled with JS.
- Webpack for bundling the scripts.

The project's main classes will be as follows:

`game_view.js` : Serves as the game engine, runs the game until a win or loss condition is met, calls the `Game` class's `step` methods to methodically execute the operations of each moment of the game. `game_view` utilizes `bindKeyHandlers()` to detected keyboard input, including difficulty selection, laser fire, and ship orientation and acceleration. 

`game.js` : The secondary driver of the game. This class will store all of the objects in the game in arrays. It will iterate over these arrays and remove asteroids, asteroid fractals, and powerups as needed depending on collisions. The `game` class also generates random positions for `asteroids`.

`moving_object.js` : The super class from which asteroids, lasers, ship, and powerups inherit. 

`utils.js` : A collection of methods used for handling various mathematical computations in the game, such as RNG (for calculating the chance an asteroid will fragment upon being hit, or the spawn of a powerup). Utils also handles several tweaks to the game depending on the `difficulty` passed in. Utils is also where prototypal inheritance occurs thorugh the `inherits` method using surrogates. 

## Dual Canvas

Asteroids uses a second Canvas invisible to the player in order to rotate the ship without disrupting the main canvas. The ship is rotated on the second canvas, the rotated sprite is cached, returned, and then redrawn on the original canvas:

```
rotateAndCache: function(image, angle) {
    let offscreenCanvas = document.createElement('canvas');
    let offscreenCtx = offscreenCanvas.getContext('2d');

    let size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;

    offscreenCtx.translate(size/2, size/2);
    offscreenCtx.rotate(angle);
    offscreenCtx.drawImage(image, -(image.width/2), -(image.height/2));

    return offscreenCanvas;
  }

  ```

## Future Directions 

- Black holes: swirling vortices that require unique usage of the game's `vector` functions that will 'draw in' any ship foolish enough to get close to it, resulting an an automatic loss. 
- Endless Mode: allow for an endless barrage of asteroids and a score counter in the upper right corner.