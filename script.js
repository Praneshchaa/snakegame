var snake,
  dir,
  dstep,
  dt,
  moves,
  food,
  growth,
  playing = true;
(DIR = { UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3, OPPOSITE: [1, 0, 3, 2] }),
  (KEY = {
    LEFT: "ArrowLeft",
    UP: "ArrowUp",
    RIGHT: "ArrowRight",
    DOWN: "ArrowDown",
    SPACE: "",
    ESC: "Escape",
  });
(canvas = document.getElementById("canvas")),
  (width = canvas.width = 600),
  (height = canvas.height = 600),
  (ctx = canvas.getContext("2d")),
  (nx = 40), //no of rows
  (ny = 40), // no of colm
  (dx = width / nx), // widthh of cell
  (dy = height / ny); // height of cell

//game state
function play() {
  reset();
  playing = true;
}

function lose() {
  playing = false;
}

function reset() {
  dstep = 0.08;
  dt = 0;
  moves = [];
  snake = [{ x: 30, y: 10 }];
  dir = DIR.LEFT;
  food = unoccupied();
  growth = false;
}

// whhen head eats food or runs into it self

// to allow normal snake movement
function update(idt) {
  // time it took to draw previous frame
  if (playing) {
    dt = dt + idt;
    //only if this is true the snake will move
    if (dt > dstep) {
      dt = dt - dstep;
      moveSnake(moves.shift());

      /*if the new head is a cell that is occupied by the snake then the 
game is over, otherwise if the cell contains food then the snake 
grows and a new food item is placed*/
      if (snakeOccupies(snake[0], true)) {
        lose();
      } else if (foodOccupies(snake[0])) {
        growth = true;
        food = unoccupied();
      }
    }
  }
}

// canvas drawing
function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.globalAlpha = playing ? 1 : 0.5;

  ctx.fillStyle = "green";
  ctx.fillRect(food.x * dx, food.y * dy, dx, dy);

  ctx.fillStyle = "black";
  ctx.fillRect(snake[0].x * dx, snake[0].y * dy, dx, dy);

  snake.slice(1).forEach((segment) => {
    ctx.fillStyle = "#1080F0";
    ctx.fillRect(segment.x * dx + 1, segment.y * dy + 1, dx - 2.5, dy - 2.5);
  });

  ctx.fillStyle = "green";
  ctx.font = "bold 18pt arial";
  ctx.fillText(snake.length.toString(), 10, 30);
}

// how the direction of the snake will be changed
function moveSnake(changeDir) {
  dir = typeof changeDir !== "undefined" ? changeDir : dir; //checking value or not in array (dir will store value)
  switch (dir) {
    case DIR.LEFT:
      snake.unshift({
        x: snake[0].x === 0 ? nx - 1 : snake[0].x - 1,
        y: snake[0].y,
      });
      break;

    case DIR.RIGHT:
      snake.unshift({
        x: snake[0].x === nx - 1 ? 0 : snake[0].x + 1,
        y: snake[0].y,
      });
      break;

    case DIR.UP:
      snake.unshift({
        x: snake[0].x,
        y: snake[0].y === 0 ? ny - 1 : snake[0].y - 1,
      });
      break;

    case DIR.DOWN:
      snake.unshift({
        x: snake[0].x,
        y: snake[0].y === ny - 1 ? 0 : snake[0].y + 1,
      });
      break;
  }
  //if food is eaten dont remove last array or else pop it
  if (growth) {
    growth = false;
  } else {
    snake.pop();
  }
}

// returns true if a and b are eqqual it means that food is eaten
function occupies(a, b) {
  return a && b && a.x === b.x && a.y === b.y;
}

//food and position of the head
function foodOccupies(pos) {
  return occupies(food, pos);
}

//checking if there is snake segment head is excluded
function snakeOccupies(pos, ignoreHead) {
  var i;

  for (i = ignoreHead ? 1 : 0; i < snake.length; i++) {
    if (occupies(snake[i], pos)) {
      return true;
    }
  }
  return false;
}

//for generating food
function unoccupied() {
  var pos = {};
  do {
    //making sure food i generated inside canvas
    pos.x = random(0, nx - 1);
    pos.y = random(0, ny - 1);
    //checking is there food in current canvas or snake body part
  } while (foodOccupies(pos) || snakeOccupies(pos));
  return pos;
}
// generating food in random pos inside canvas
function random(min, max) {
  return Math.floor(Math.random() * max + min);
}

//same direction or opposite is ignored
function move(where) {
  var previous = moves.length ? moves[moves.length - 1] : dir; //check if there is any previous direction
  if (where !== previous && where !== DIR.OPPOSITE[previous]) {
    moves.push(where);
  }
}

//adding functionalities to keys
function onkeydown(event) {
  var handled = false; //to stop scrolling webpage
  if (playing) {
    //the keys should work only if playing is true
    switch (event.key) {
      case KEY.LEFT:
        move(DIR.LEFT);
        handled = true; //to enable functionalities of keys
        break;

      case KEY.RIGHT:
        move(DIR.RIGHT);
        handled = true;
        break;

      case KEY.UP:
        move(DIR.UP);
        handled = true;
        break;

      case KEY.DOWN:
        move(DIR.DOWN);
        handled = true;
        break;

      case KEY.ESC:
        lose();
        handled = true;
        break;

      case KEY.SPACE:
        handled = true;
        break;
    }
  } else if (event.key === KEY.SPACE) {
    play();
    handled = true;
  }

  if (handled) {
    event.preventDefault();
  }
}

document.addEventListener("keydown", onkeydown, false);

var start,
  // need to set last frame to current timestamp bcoz building frame takes time
  last = new Date().getTime();
function frame() {
  start = new Date().getTime(); // giving same timestamp to continue the frame
  update((start - last) / 1000); //update and draw the frame (using seconds)
  draw();

  last = start;
  setTimeout(frame, 1);
}
reset();
frame();
