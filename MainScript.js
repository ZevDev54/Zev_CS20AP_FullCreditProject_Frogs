let allObjectsToUpdate = [];

let frogTeams = [];
let teamAmount = 4;
let frogs = [];
let mushrooms = [];

let frogSprite;
let mushSprite;
let allFrogSprites = [];
let impactSprite;
let heartSprite;
let titleSprite;

let mushCount = 3;
let frogCount = 75;

let mushSpawnRate = 1000;
let mushSpawnTimer;

let frogSpr;

let gameStarted = false;

// let startButtonX = width / 2;
// let startButtonY = width / 2;
// let startButtonW = 50;
// let startButtonH = 50;
let randomFrogTitle;



function preload() {
  frogSprite = loadImage("images/Frog.png");
  mushSprite = loadImage("images/Mushroom.png");

  allFrogSprites.push(loadImage("images/coloredFrogs/GreenFrog.png"));
  allFrogSprites.push(loadImage("images/coloredFrogs/BlueFrog.png"));
  allFrogSprites.push(loadImage("images/coloredFrogs/PinkFrog.png"));
  allFrogSprites.push(loadImage("images/coloredFrogs/YellowFrog.png"));

  impactSprite = loadImage("images/Clash.png");
  heartSprite = loadImage("images/Heart.png");

  titleSprite = loadImage("images/Title.png");

}


function setup() {
  let sketch = createCanvas(800, 800);
  // fullscreen(true)
  sketch.parent("mycanvas");


  // setupGame();

  randomFrogTitle = allFrogSprites[floor(random(0,4))];

  // frogSpr = new Sprite(100,100)
  // frogSpr.img = frogSprite;

}//end setup


function setupGame() {

  mushrooms = [];
  frogs = [];

  
  for (let i = 0; i < mushCount; i++) {
    mushrooms.push(new Mushroom(random(-worldBounds, worldBounds), random(-worldBounds, worldBounds), 10, mushSprite, mushrooms))
  }
  allObjectsToUpdate.push(mushrooms);

  for (let i = 0; i < frogCount; i++) {
    let frogTeam = floor(random(0, teamAmount))
    frogs.push(
      new Frog(
        random(-worldBounds, worldBounds),
        random(-worldBounds, worldBounds),
        20,
        frogSprite,
        frogs,
        frogTeam,
        100
      ))
  }
  allObjectsToUpdate.push(frogs);

  gameStarted = true;
}

function draw() {
  background("#d1f7be")

  if (gameStarted) {
    update_game();
  }
  else {
    doTitleScreen();


  }
}//end draw

function update_game() {
  // text("amongus",50,50)
  // worldBounds = frogs.length * sizePerFrog


  if (debugMode) {
    noStroke()
    let fps = frameRate().toFixed(2);
    text(fps, 50, 50);
  }

  UpdateCamera()
  fill('#D6FFC2')
  rectMode(CENTER)
  noStroke()

  rect(0, 0, worldBounds * 2, worldBounds * 2)
  // followCam(frogs[0].x, frogs[0].y)




  // for(let l = 0; l < allObjectsToUpdate.length; l++)
  //   {
  //     for(let o = 0; o < allObjectsToUpdate[l].length; o++)
  //       {
  //         allObjectsToUpdate[l][o].update();

  //         if(!allObjectsToUpdate[l][o].isStatic)
  //         {
  //           for(let z = 0; z < allObjectsToUpdate.length; z++) //collide against all others.
  //             {

  //             }
  //         }
  //       }
  //   }

  sweepDestroyList(mushrooms);
  sweepDestroyList(frogs);

  for (let i = 0; i < mushrooms.length; i++) {
    mushrooms[i].update()
  }


  for (let i = 0; i < frogs.length; i++) {
    frogs[i].update()
    frogs[i].collide(frogs);
    frogs[i].collide(mushrooms);

  }

  if (mushSpawnTimer < mushSpawnRate) {
    mushSpawnTimer += gameDelta();
  }
  else {
    mushrooms.push(new Mushroom(random(-worldBounds, worldBounds), random(-worldBounds, worldBounds), 10, mushSprite, mushrooms))
    mushSpawnTimer = 0;
  }


  updateImpacts()





  // translate(width / 2 - frogs[0].x, height / 2 - frogs[0].y);

  // camera.zoom = 0.05
  // camera.position.x = frogs[0].x
  // camera.position.y = frogs[0].y

}

function doTitleScreen()
{
  textSize(30);

  imageMode(CENTER)

   let t = millis()/1000;
  
  let w = 500;
  let h = (w/titleSprite.width)*titleSprite.height;
  let offsetX = sin(t*+0.5)*3;
  let offsetY = cos(t+0.5)*8;
  
  image(titleSprite, width/2, 150, w + offsetX, h + offsetY)

  
  textAlign(CENTER);
  text("Press R to start/restart!", width / 2, height / 2 + 300)
  textAlign(LEFT);

textSize(20);
  text("A ZevDev simulation", 25, height - 25)
  
 

  w = 300;
  h = (w/randomFrogTitle.width)*randomFrogTitle.height;

  offsetX = sin(t*3)*3;
  offsetY = cos(t*3)*8;

  


  image(randomFrogTitle, width/2, height/2 - offsetY/2 + 100, w + offsetX, h + offsetY)
}

// function draw()
// {
//   background(255, 255, 255);


//   //.5 zoom is zooming out (50% of the normal size)
//   if(mouseIsPressed)
//     camera.zoom = 0.5;
//   else
//     camera.zoom = 1;

//   //set the camera position to the ghost position
//   camera.position.x = sin(millis()/1000)*50
//   camera.position.y = sin(millis()/1000)*50

//   fill("red")
//   ellipse(50,50,50,50);

//   //I can turn on and off the camera at any point to restore
//   //the normal drawing coordinates, the frame will be drawn at
//   //the absolute 0,0 (try to see what happens if you don't turn it off
//   // camera.off();

// }
function keyPressed() {
  if (key == '~') {
    debugMode = !debugMode;
    console.log("debug mode " + (debugMode ? "enabled" : "disabled"))
  }

  if (key == "i" || key == "I") {
    gameTimeScale += 0.5;
  }

  if (key == "o" || key == "o") {
    gameTimeScale -= 0.5;
  }

  if (key == "r" || key == "R") {
    setupGame()
  }
}

function mousePressed() {
  mushrooms.push(new Mushroom(worldMouseX(), worldMouseY(), 10, mushSprite, mushrooms))


  console.log(worldMouseX(), worldMouseY())

  // if (mouseX)
}

