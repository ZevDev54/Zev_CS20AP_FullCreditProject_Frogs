let worldBounds = 750;
// let sizePerFrog = 9;

let worldSafeZone = 100;

let debugMode = false;
let debugText = false;
let debugLines = true;
let debugTarget = false;

let gameTimeScale = 1;

class GameObject {
  constructor(x, y, rad, spr, parentList) {

    this.x = x;
    this.y = y;


    this.parentList = parentList;
    // this.markForDeath = false;

    this.collisionForce = 0.1;
    this.outOfBoundsForce = 0.2;


    this.spr = spr;
    this.rad = rad

    this.isStatic = false;

    this.vx = 0;
    this.vy = 0;
    this.dragCoef = 0.95;

    this.destroyMe = false;


    // this.persistentSprite = new Sprite(this.x,this.y);
    // this.persistentSprite.img = spr;
    // this.persistentSprite.diameter = 1;

  }



  position() {
    return createVector(this.x, this.y);
  }

  draw() {
    // console.log("frog sprite is"+this.spr)
    imageMode(CENTER);
    // console.log(this.x)

    // console.log("code cganege!!!")

    let w = this.rad * 2;
    let ratio = w / this.spr.width
    let h = this.spr.height * ratio;

    image(this.spr, this.x, this.y, w, h);

    // this.persistentSprite.x = this.x;
    // this.persistentSprite.y = this.y;

    // circle(this.x, this.y, this.rad*2) 
    // noTint()
  }

  collide(otherBodies) {
    if (this.x > worldBounds + worldSafeZone) {
      this.applyForce(-this.outOfBoundsForce, 0)
    }

    else if (this.x < -worldBounds - worldSafeZone) {
      this.applyForce(this.outOfBoundsForce, 0)
    }

    if (this.y < (-worldBounds - worldSafeZone)) {
      this.applyForce(0, this.outOfBoundsForce)
    }

    else if (this.y > worldBounds + worldSafeZone) {
      this.applyForce(0, -this.outOfBoundsForce)
    }

    for (let i = 0; i < otherBodies.length; i++) {
      if (this != otherBodies[i]) {
        let distTo = dist(this.x, this.y, otherBodies[i].x, otherBodies[i].y);
        // console.log("Dist to: "+distTo)
        // textSize(20)
        // text(distTo.toString(), this.x, this.y)
        if (distTo
          < (this.rad + otherBodies[i].rad)) {
          this.collisionWith(otherBodies[i])
        }
      }
    }
  }

  collisionWith(object) {
    //Debug
    if (debugMode) {
      stroke('red')
      strokeWeight(5);
      line(this.x, this.y, object.x, object.y)
    }
    // stroke(0)
    // strokeWeight(1);
    // textSize(10)
    // text(distTo.toString(), this.x, this.y)


    // console.log(distTo)
    // console.log("collide!")

    let differenceVector = this.position().sub(object.position());
    // console.log(differenceVector)

    // console.log(differenceVector.x, " ", differenceVector.y);
    let force = differenceVector.normalize().mult(this.collisionForce)
    this.applyForce(force.x, force.y);
  }

  applyForce(xForce, yForce) {
    this.vx += xForce;
    this.vy += yForce;
  }

  physics() {
    this.x += this.vx;
    this.y += this.vy;

    this.vx *= this.dragCoef;
    this.vy *= this.dragCoef;
  }


  update() {
    if (!this.isStatic)
      this.physics();
    this.draw();
  }

  destroy() {
    console.log("Im trying to die!")
    this.destroyMe = true; // avoids splicing problems.

    // if(this.parentList)
    // {
    // for(let i = 0; i < this.parentList.length; i++)
    //   {
    //     if(this.parentList[i] == this)
    //     {
    //       console.log("I am dead!")
    //       this.parentList.splice(i,1);
    //     }
    //   }
    // }
    // else{
    //   // console.log("Parentlist undefined!")
    // }
  }



}



function gameDelta() {
  return deltaTime * gameTimeScale


}

function vectorFromTo(originObject, destinationObject) {
  if (originObject && destinationObject) {
    let vec = createVector(destinationObject.x - originObject.x, destinationObject.y - originObject.y);

    return vec;
  }
  return createVector(0, 0);
}

// function calcDist(x1,y1,x2,y2)
// {
//   dx = abs(x1-x2)
//   dy = abs(y1-y2)
//   return sqrt(dx*dx, dy*dy)
// }

//helper function: find the closest object in a list to the target.
function findClosestToMe(GameObject, list) {
  // console.log(GameObject);
  // console.log(list);

  let closestIndex = 0;
  let closestDist = 10000;
  for (let i = 0; i < list.length; i++) {
    if (GameObject != list[i]) {
      //add offset to list element for mroe randomization+ choose not same targets as friendlies.
      let d = dist(GameObject.x, GameObject.y, list[i].x, list[i].y);
      if (d < closestDist) {
        closestIndex = i;
        closestDist = d;
      }
    }
  }

  // console.log("FOund:"+list[closestIndex])
  return list[closestIndex];
}


function sweepDestroyList(list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].destroyMe) {
      list.splice(i,1);
      i--;
    }
  }
}