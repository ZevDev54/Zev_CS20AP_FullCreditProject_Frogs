let allObjectsToUpdate = [];

let frogTeams = [];
let teamAmount = 4;
// let frogs = [];
let mushrooms = [];

let frogSprite;
let mushSprite;


let mushCount = 3;
let frogCount = 100;

let mushSpawnRate = 500;
let mushSpawnTimer;

let frogSpr;


function preload() {
  frogSprite = loadImage("images/Frog.png");
  mushSprite = loadImage("images/Mushroom.png");
}


function setup() {
  let sketch = createCanvas(800, 800);
  fullscreen(true)
  sketch.parent("mycanvas");

  for(let i = 0; i < teamAmount; i++)
    {
      frogs[i] = [];
    }

  for (let i = 0; i < mushCount; i++) {
    mushrooms.push(new Mushroom(random(-worldBounds, worldBounds), random(-worldBounds, worldBounds), 10, mushSprite, mushrooms))
  }
  allObjectsToUpdate.push(mushrooms);

  for (let i = 0; i < frogCount; i++) {
    let frogTeam = floor(random(0,4))
    frogs.push(
      new Frog(
        random(-worldBounds, worldBounds), 
        random(-worldBounds, worldBounds), 
        20, 
        frogSprite, 
        frogs, 
        frogTeam
      ))
  }
  allObjectsToUpdate.push(frogs);



  // frogSpr = new Sprite(100,100)
  // frogSpr.img = frogSprite;

}//end setup



function draw() {
  background("#d1f7be")
  // text("amongus",50,50)
  
  UpdateCamera()
  fill('#D6FFC2')
  rectMode(CENTER)
  noStroke()
  
  rect(0,0, worldBounds*2, worldBounds*2)
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


  if (debugMode) {
    noStroke()
    let fps = frameRate().toFixed(2);
    text(fps, 50, 50);
  }

  // translate(width / 2 - frogs[0].x, height / 2 - frogs[0].y);

  // camera.zoom = 0.05
  // camera.position.x = frogs[0].x
  // camera.position.y = frogs[0].y

}//end draw

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
}

function mousePressed() {
  mushrooms.push(new Mushroom(worldMouseX(), worldMouseY(), 10, mushSprite, mushrooms))

  console.log(worldMouseX(), worldMouseY())
}

