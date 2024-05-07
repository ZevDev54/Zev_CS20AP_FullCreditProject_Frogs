let allObjectsToUpdate = [];

let frogs = [];
let mushrooms = [];

let frogSprite;
let mushSprite;


let mushCount = 3;
let frogCount = 3;

function preload() {
  frogSprite = loadImage("images/Frog.png");
  mushSprite = loadImage("images/placeholder-mushroom.png");
}


function setup() {
  let sketch = createCanvas(800, 800);
  sketch.parent("mycanvas");



  for (let i = 0; i < mushCount; i++) {
    mushrooms.push(new Mushroom(random(50, width - 50), random(50, height - 50), 30, mushSprite, mushrooms))
  }
  allObjectsToUpdate.push(mushrooms);

  for (let i = 0; i < frogCount; i++) {
    frogs.push(new Frog(random(50, width - 50), random(50, height - 50), 20, frogSprite, frogs))
  }
  allObjectsToUpdate.push(frogs);





}//end setup




function draw() {
  background("#d6ffc2")

  
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


  if (debugMode) {
    noStroke()
    let fps = frameRate().toFixed(2);
    text(fps, 50, 50);
  }

}//end draw

function keyPressed() {
  if (key == '~') {
    debugMode = !debugMode;
    console.log("debug mode " + (debugMode ? "enabled" : "disabled"))
  }

  if(key == "i" || key == "I")
  {
    gameTimeScale += 0.1;
  }

  if(key == "o" || key == "o")
  {
    gameTimeScale -= 0.1;
  }
}

function mousePressed()
{
  mushrooms.push(new Mushroom(mouseX, mouseY, 30, mushSprite, mushrooms))
}