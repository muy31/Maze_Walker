# README for Maze Walker # (from Code.org)

This is the README file for the Maze Walker app. It's a great place to write
down some notes about how your app works. For starters, here is some information
about the other files in this folder.

The files in this folder contain everything you need to run your app:

* `applab/applab.js` - This file contains the applab library, which has all the
  javascript that applab uses to run your app.

* `applab/applab.css` - This file contains some default CSS styling for your app.

* `index.html` - This is the html file that you designed in applab using the
  Design tab. It contains all the buttons, text inputs, and other controls for
  your app. Go here to add additional controls to your app.

* `style.css` - This file defines the custom styling for each control in your
  app that you specified under the Design tab. Go here to change the colors,
  positions, dimensions, and other properties of your app's controls.

* `code.js` - This file has all the code you wrote for your app. Go here to add
  new behavior to your app.

* `assets` - This is a directory with all the asset files (pictures and sounds)
  that you uploaded in applab.


From Code Authors (Me!):

* Made using Code.org's App Lab. See product at muy31.github.io/maze-walker

This is a little widget that utilizes (and gives a visualization of) one of many different algorithms for pathfinding.

On start, a square grid should appear with black squares (that represent walls)
and purple squares (empty spaces). Simply click on two empty locations in the grid 
and press solve to view the program's implementation of a breadth-first-search to 
find a/the shortest path between the two chosen locations.

To generate a new maze:
- Enter an integer into the text input labeled "Square Size", which controls the width and height of the maze.
- Enter a decimal between 0 and 1 into the text input labeled "Wall Probability" to set an average frequency of walls within the maze.
- Click "New Maze" to generate the maze.

Warnings and Bugs:
- No input validation is currently coded into the text input handlers, although it should not have much effect.
- Bugs with placing start and end positions within walls, code may still 'find a path' to a neighboring empty square instead of not findind a path at all.
