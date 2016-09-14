![asteroids](https://github.com/willashley23/Asteroids/blob/master/images/screenshot1.png)

## Background

My recreation of the classic Atari game utilizes vanillia JavaScript and DOM manipulation along with the Canvas API to simulate a retro gaming experience. 

## Screenshots

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

`utils.js` : A collection of methods used for handling various mathematical computations in the game, such as RNG (for calculating the chance an asteroid will fragment upon being hit, or the spawn of a powerup). Utils also handles several tweaks to the game depending on the `difficulty` passed in.


## Future Directions 

- Black holes: swirling vortices that require unique usage of the game's `vector` functions that will 'draw in' any ship foolish enough to get close to it, resulting an an automatic loss. 
 
