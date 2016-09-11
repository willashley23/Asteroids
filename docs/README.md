# Asteroids 

## Background

This is a recreation of the classic Atari game with a few twists! The game is made with pure vanillia JavaScript and Canvas for rendering in the browser.

The game will, at a minimum, have the following features by September 16th, 2016.

## MVP

My recreation of Asteroids will have several features for user interaction:

- [ ] A working win/loss system with three lives.
- [ ] An 8-bit design.
- [ ] Sound effects for certain aspects of the game (such as firing lasers).
- [ ] WASD controls that allow the user to orient the ship in cardinal directions.

## Wireframes

![wireframes](https://github.com/willashley23/Asteroids/blob/master/images/mockup.png)

## Structure and Technologies

The project will rely on the following technologies: 

- Vanillia JavaScript for game logic, including collision detection, win/loss conditions/ and distribution of powerups.
- Canvas will be used to render images of asteroids, ships, and powerups on the screen, however, their hitboxes will be measured and handled with JS.
- Webpack for bundling the scripts.

The project's classes will be as follows:

`game_view.js` : Serves as the game engine, runs the game until a win or loss condition is met, calls the `Game` class's `step` methods to methodically execute the operations of each moment of the game.

`game.js` : The secondary driver of the game. This class will store all of the objects in the game in arrays. It will iterate over these arrays and remove asteroids, asteroid fractals, and powerups as needed depending on collisions. The `game` class also generates random positions for `asteroids`.

`moving_object.js` : The super class from which asteroids, lasers, ship, and powerups inherit. 

`utils.js` : A collection of methods used for handling various mathematical computations in the game, such as RNG (for calculating the chance an asteroid will fragment upon being hit, or the spawn of a powerup).


## Implementation Timeline

### Day 1: Setup basic foundation for the 8 bit look of the game. Gather images of asteroids, ship, moving background, lasers, and powerups. Resize and render on the screen and handle their collision detection. Goals:
 - Successful game phyiscs 
 - Complete most of 8 bit interface
 - Handle keybindings for user input

### Day 2: Handle advanced game logic. Create methods for handling losses of lives, the destruction of all asteroids, etc. Goals:
  - Have a functioning game with wins and losses by the end of the day

### Day 3: Adding more layers and depth to the functionality of the game. Goals:
  - Have the image of the ship point in the same direction that matches its velocity vetor by drawing it on a rotation canvas.
  - Implement asteroid fragmenting: asteroids will have a 30% chance of breaking up into three smaller asteroids upon being hit.
  - Add force field around ship that will indicate a powerup has been acquired.

### Day 4: 8-bit Sound effects. Goals:
  - laser firiing
  - Being hit by an asteroid
  - Asteroid fragmentation 
  - Powerup acquired
  - Game over
  - Victory 

## Bonus Features

There are a host of bonus features that will be implemented if there is extra time by day 4.

- [ ] Difficulty modes: easy, medium, and hard, which will be differentiated by the number of asteroids, a higher chance of fragmentation, and fewer powerups.
- [ ] Black holes: randomly spawn black holes that, when near the ship, begin pulling the ship towards it, and if collided with, causes an automatic loss.
- [ ] Home screen that completes the 8 bit aesthetic. A large header with the words "Asteroids", a diagram of the controls, explanation of the difficulty modes, etc.

   