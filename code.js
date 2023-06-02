//Global variables
var gridSize = 25;
var squareS;
var wallFactor = 0.38;
var canvasCreated = false;

var stR = 0;
var stC = 0;

var cX;
var cY;

var eR = 0;
var eC = 0;

var numClicks = 0;

//Intial maze creation
var maze = createMaze(gridSize, wallFactor);
mazeDisplay(maze, 160, 225, 200, 200);

//Initialize a new maze on click
onEvent("button2", "click", function( ) {

  if(getNumber("mazeSize") > 0){
    
    gridSize = getNumber("mazeSize");
    wallFactor = getNumber("wallFactor");
    
    maze = createMaze(gridSize, wallFactor);
    mazeDisplay(maze, 160, 225, 200, 200);
    
    numClicks = 0;
  }
});


//The map array is created and returned in this function
function createMaze(size, factor){
  var map = [];
  for(var i = 0; i < size; i++){
    
    var row = [];
    
    for(var j = 0; j < size; j++){
      if(Math.random() < factor){
        row.push('#'); //push is the same as append
      }else{
        row.push(' ');
      }
    }
    
    map.push(row);
  }
  
  return map;
}

//Prints the maze array into the console (for debugging)
displayMap(maze);

//Displays the maze on screen
//Uses canvas rectangles
function mazeDisplay(grid, centerX, centerY, width, height){
  
  //must be cleared to prevent overlap of canvas
  clearCanvas();
  
  //attempts to ease up location determination by using centers intead of top left corners
  cX = centerX;
  cY = centerY;
  
  //Creates maze 
  var squareSize;
  
  //Scales maze squares according to max maze size
  if(width/grid[0].length < height/grid.length){
    squareSize = width/grid[0].length;
  }else{
    squareSize = height/grid.length;
  }
  
  squareS = squareSize;
  
  if(!canvasCreated){
    createCanvas("canvas", squareSize*grid[0].length, squareSize*grid.length);
    canvasCreated = true;
  }
  
  setPosition("canvas", 0, 0, squareSize*grid[0].length, squareSize*grid.length);
  setActiveCanvas("canvas");
  
  setStrokeWidth(1);
  setStrokeColor("white");
  
  for(var r = 0; r < grid.length; r++){
    
    for(var c = 0; c < grid[r].length; c++){
      if(grid[r][c] == '#'){
        setFillColor("black");
        rect(c*squareSize, r*squareSize, squareSize, squareSize); //Draws a wall in the corresponding location
      }else{
        //setFillColor("white");
        //rect(c*squareSize, r*squareSize, squareSize, squareSize);
      }
    }
  }
  
  setStrokeColor("black");
  setStrokeWidth(1);
  setFillColor(rgb(255,255,0,0));
  rect(0,0,squareSize*grid[0].length, squareSize*grid.length); //Maze boundary
  
  //Moves maze to position
  
  var offsetX = (squareSize*grid[0].length)/2;
  var offsetY = (squareSize*grid.length)/2
  
  setPosition("canvas", centerX - offsetX, centerY - offsetY, getProperty("canvas", "width") ,getProperty("canvas", "height") );

}

//When clicked once (numClicks == 0), add start position and display as colored circle
//When clicked twice (numClicks == 1), add end position
onEvent("canvas", "click", function(event) {
  //Handles clicking stuff
  
  var offsetX = (squareS*maze[0].length)/2;
  var offsetY = (squareS*maze.length)/2
  
  if(numClicks == 0){
    
    x = event.x - (cX - offsetX);
    y = event.y - (cY - offsetY);
    
    //Calculate row and column
    
    var row = Math.floor(y/squareS);
    var col = Math.floor(x/squareS);
    
    maze[row][col] = "O";
    
    //Global changes
    stR = row;
    stC = col;
    
    //Draws the starting circle
    var startColor = rgb(255, 255, 0, 0.7);
    
    setFillColor(startColor);
    setStrokeColor(startColor);
    setStrokeWidth(0.01);
    circle(col*squareS + squareS/2, row*squareS + squareS/2, squareS/2, squareS/2);
    
    numClicks += 1;
    
    //Displays maze in console
    displayMap(maze);
    
    
  }else if(numClicks == 1){
    
    x = event.x - (cX - offsetX);
    y = event.y - (cY - offsetY);
    
    //Calculate row and column
    
    var row = Math.floor(y/squareS);
    var col = Math.floor(x/squareS);
    
    maze[row][col] = "G";
    
    //Global changes
    eR = row;
    eC = col;
    
    //Draws the ending circle
    var startColor = rgb(0, 255, 0, 0.9);
    
    setFillColor(startColor);
    setStrokeColor(startColor);
    setStrokeWidth(0.01);
    circle(col*squareS + squareS/2, row*squareS + squareS/2, squareS/2, squareS/2);
    
    numClicks += 1;
    
    //Displays maze in console
    displayMap(maze);
  }
  
});

//What to call when the solve button is clicked
onEvent("button1", "click", function( ) {
  displayPath(backtrace(solveMaze(maze, stR, stC, eR, eC)), squareS);
});

//Colors out the locations found in a path according to a 'path array/table'
function displayPath(path, squareSize){
  
  if(path == null){
    setText("label1", "Path not found!");
    return;
  }else{
    setText("label1", "Path was found!");
  }
  
  setFillColor(rgb(255,255,255,0.5));
  for(var i = 0; i < path.length; i++){
    rect(path[i][1]*squareSize, path[i][0]*squareSize, squareSize, squareSize);
  }
  
  rect(stC*squareSize, stR*squareSize, squareSize, squareSize);
}


//Print array to console function
function displayMap(grid){
  for(var r = 0; r < grid.length; r++){
    var str = "";
    for(var c = 0; c < grid[r].length; c++){
      str += grid[r][c] + " ";
    }
    console.log(str);
  }
}

//Determines the path given an array of explored locations (and their parent locations) in maze
//Returns a 'path array/table'
function backtrace(locusNodes){
  var path = [];
  
  console.log(" ");
  displayMap(maze);
  console.log(" ");
  
  if(locusNodes == null){
    console.log("No path found!");
    return null;
  }
  
  var n = locusNodes.length - 1;
  
  while(locusNodes[n].length > 2){
    path.push(locusNodes[n]);
    var search = locusNodes[n][2];
    
    for(var i = 0; i < locusNodes.length; i++){
      if(locusNodes[i][0] == search[0] && locusNodes[i][1] == search[1]){
        n = i;
        break;
      }
    }
    
    //console.log(path);
  }
  
  
  
  console.log("Path found!");
  displayMap(path);
  return path;
  
}

//Solves maze using breadth first search and adds values to an array
//Returns an array of explored locations and parents 
function solveMaze(grid, startR, startC, endR, endC){
  
  //Empty out 'S'
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
        if(grid[i][j] == 'S'){
          grid[i][j] == ' ';
        }
    }
  }
  
  
  //make empty integer array
  var intGrid = [];
  for (var i = 0; i < grid.length; i++) {
    intGrid[i] = [];
    for (var j = 0; j < grid[i].length; j++) {
        intGrid[i].push(0);
    }
  }
  
  
  
  var dist = 1;
  intGrid[startR][startC] = dist;
  
  var allFrontier = [[startR, startC]];
  var frontierNodes = [[startR, startC]];
    
  console.log(intGrid);
  
  setFillColor(rgb(0,0,150,0.2));
  
  //Looping here
  while(true){
    dist++;
    var nextFrontier = [];
    
    if(frontierNodes.length < 1){
      return null;
    }
    
    for(var i = 0; i < frontierNodes.length; i++){
      var locus = frontierNodes[i];
      grid[locus[0]][locus[1]] = 'S';
      
      var neighbors = findNeighbors(grid, locus[0], locus[1], 'S');
      
      for(var n = 0; n < neighbors.length; n++){
        intGrid[neighbors[n][0]][neighbors[n][1]] = dist;
        grid[neighbors[n][0]][neighbors[n][1]] = 'S';
        rect(neighbors[n][1]*squareS,neighbors[n][0]*squareS, squareS, squareS);
        nextFrontier.push(neighbors[n]);
        
        if(neighbors[n][0] == endR && neighbors[n][1] == endC){
          displayMap(intGrid);
          allFrontier = allFrontier.concat(nextFrontier);
          return allFrontier;
        }
        
        
      }
      
    }
    frontierNodes = nextFrontier;
    allFrontier = allFrontier.concat(frontierNodes);
    //console.log(intGrid);
  }
  
}


//Finds the nearest neighbors surrounding a cell within a 2d array: grid, with row-col coordinates: r and c
//Requires a key, which is the character in the cell which should not be traversed 
function findNeighbors(grid, r, c, key){
  var array = [];
  for(var i = 0; i < 4; i++){
    var coord = nextDir(grid, r, c, i);
    if(coord !== null && grid[coord[0]][coord[1]] !== key){
      array.push(coord);
    }
  }
  return array;
}


//Takes a 2d array of characters, where a wall is denoted as '#', (), a row and column coordinate (integral indices of the array), and an integer denoting direction (0-3 correspond to up, right, down, left respectively)
//This function returns an array with two integers denoting the coordinates of the neighboring array cell in the direction requested, if that is not possible, returns null
function nextDir(grid, r, c, dir){
  if(r < 0 || c < 0 || r >= grid.length || c >= grid[0].length){
    return null;
  }
  
  if(grid[r][c] == '#'){
    return null;
  }
  
  if(dir == 0){
    if(r > 0){
      if(grid[r - 1][c] == '#'){
        return null;
      }
      return [r - 1, c, [r, c]];
    }
  }else if (dir == 2){
    if(r < grid.length - 1){
      if(grid[r + 1][c] == '#'){
        return null;
      }
      return [r + 1, c, [r, c]];
    }
  }else if (dir == 1){
    if(c < grid[r].length - 1){
      if(grid[r][c + 1] == '#'){
        return null;
      }
      return [r, c + 1, [r, c]];
    }
  }else if (dir == 3){
    if(c > 0){
      if(grid[r][c - 1] == '#'){
        return null;
      }
      return [r, c - 1, [r, c]];
    }
  }
  
  return null;
  
}


