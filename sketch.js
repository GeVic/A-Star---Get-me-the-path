var rows = 25;
var cols = 25;
// width and height of the spot
var w, h;
var start, end;
// canvas grid
var grid = new Array(cols);
// Open set
var openSet = [];
var closedSet = [];
var path = [];

function removeFromSet(set, element) {
  for (var i = set.length - 1; i >= 0; i--) {
    if (set[i] == element) {
      // Removes element at i
      set.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  // Euclidean distance
  var distance = abs(a.i, b.i) + abs(a.j, b.j);
  return distance;
}

// spot object
function spot(i, j) {  
  this.gValue = 0;
  this.hValue = 0;
  this.fScore = 0;
  this.i = i;
  this.j = j;
  this.neighbors = [];
  this.previous = null;

  // Show the spot
  this.show = function(col) {
    fill(col);
    noStroke();
    // show the box
    rect(this.i*w, this.j*h, w-1, h-1);
  }

  this.addNeighbors = function(grid) {
    if (i < cols -1) {
      this.neighbors.push(grid[this.i + 1][this.j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[this.i - 1][this.j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[this.i][this.j + 1]);
    }
    if(j > 0) {
      this.neighbors.push(grid[this.i][this.j - 1]);
    }
  }
}

function setup() {
  // Create the canvas
  createCanvas(700, 700);

  // Width and length
  w = width / rows;
  h = height / cols;

  // 2-D array
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  // Deciding each spot in grid
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new spot(i, j);
    }
  }

  // Adding the neighbors, not eficient code though
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  // Start and end point initiaization
  start = grid[0][0];
  end = grid[cols-7][rows-4];
  end.show(color(0));
  // Initial condition
  openSet.push(start);
  

}

function draw() {
  if (openSet.length > 0) {

    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[winner].fScore > openSet[i].fScore) {
        winner = i;
      }
    }
    
    var current = openSet[winner];
    
    if (current == end) {
      // trace path
      console.log("Done!");
      noLoop();
    }

   // Remove the current from the openSet and push to closedSet
   // No function to remove object from the set
   removeFromSet(openSet, current);
   //removeFromSet(openSet, current);
   closedSet.push(current);

   // Looping through all neighbors
   var neighbors = current.neighbors;
   for (var j = 0; j < neighbors.length; j++) {
     var neighbor = neighbors[j];

     if (!closedSet.includes(neighbor)) {
       var tentative_gvalue = current.gValue + 1; 
       //Check if i have more efficient path to this neighbor
       if(openSet.includes(neighbor)) {
         if(tentative_gvalue < neighbor.gValue) {
           neighbor.gValue = tentative_gvalue;
         } 
       } else {
         neighbor.gValue = tentative_gvalue;
         openSet.push(neighbor);
       }

       // Heuristics distance
       neighbor.hValue = heuristic(neighbor, end);
       neighbor.fScore = neighbor.hValue + neighbor.gValue;
       neighbor.previous = current;
     }
   }

  } else {
  }

  // Background colour
  background(0);

  // To show the grid
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if(grid[i][j] != end){
        grid[i][j].show(color(255));
      }
    }
  }
  
  // Current open and closed nodes
  for (var i = 0; i < closedSet.length; i++) {
    if(closedSet[i] != end){
      closedSet[i].show(color(255, 0, 0));
    }
  }

  for (var i = 0; i < openSet.length; i++) {
    if(openSet[i] != end){
      openSet[i].show(color(0, 255, 0));
    }
  }

  // Coloring path by every frame
  path = [];
  var final = current;
  path.push(final);
  while(final.previous) {
    path.push(final.previous);
    final = final.previous;
  }

  for (var i = 0; i < path.length; i++) {
    if(path[i] != end){
      path[i].show(color(0, 0, 255));
    }
  }


  
}