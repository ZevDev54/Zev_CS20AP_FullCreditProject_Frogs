let gameSafeBounds = 50;

class GameObject
  {
    constructor(x,y,rad,spr)
    {

      this.x = x;
      this.y = y;

      this.collisionForce = 0.1;
      this.outOfBoundsForce = 0.2;
      
      
      this.spr = spr;
      this.rad = rad

      this.isStatic = false;
      
      this.vx = 0;
      this.vy = 0;
      this.dragCoef = 0.95;
    }

    position()
    {
      return createVector(this.x, this.y);
    }
    
    draw()
    {
      // console.log("frog sprite is"+this.spr)
      imageMode(CENTER);
      // console.log(this.x)
      
      image(this.spr, this.x, this.y, this.rad*2,(this.rad*2)* 0.8);
      // circle(this.x, this.y, this.rad*2) 
    }  

    collide(otherBodies)
    {
        if(this.x > (width - gameSafeBounds))
        {
          this.applyForce(-this.outOfBoundsForce,0)
        }

      else if(this.x < gameSafeBounds)
      {
        this.applyForce(this.outOfBoundsForce,0)
      }

      if(this.y > (height - gameSafeBounds))
      {
        this.applyForce(0,-this.outOfBoundsForce)
      }

      else if(this.y < gameSafeBounds)
      {
        this.applyForce(0, this.outOfBoundsForce)
      }
      
        for(let i = 0; i < otherBodies.length; i++)
          {
            if(this != otherBodies[i])
            {
              let distTo = dist(this.x,this.y, otherBodies[i].x, otherBodies[i].y);
              // console.log("Dist to: "+distTo)
              // textSize(20)
              // text(distTo.toString(), this.x, this.y)
              if(distTo 
                 < (this.rad + otherBodies[i].rad))
              {
                collisionWith(otherBodies[i])
              }
            }
          }
    }

    collisionWith(object)
    {
      //Debug
      // stroke('red')
      // strokeWeight(5);

      // line(this.x, this.y, otherBodies[i].x, otherBodies[i].y)

      // stroke(0)
      // strokeWeight(1);
      // textSize(10)
      // text(distTo.toString(), this.x, this.y)


       // console.log(distTo)
      // console.log("collide!")

      let differenceVector = this.position().sub(otherBodies[i].position());
       // console.log(differenceVector)

      // console.log(differenceVector.x, " ", differenceVector.y);
      let force = differenceVector.normalize().mult(this.collisionForce)
      this.applyForce(force.x, force.y);
    }

    applyForce(xForce, yForce)
    {
      this.vx += xForce;
      this.vy += yForce;
    }

    physics()
    {
      this.x += this.vx;
      this.y += this.vy;

      this.vx *= this.dragCoef;
      this.vy *= this.dragCoef;
    }
    

    update()
    {
      if(!this.isStatic)
        this.physics();
      this.draw();
    }

    


    
  }

gameTimeScale = 1;

function gameDelta()
{
  return deltaTime * gameTimeScale
}


// function calcDist(x1,y1,x2,y2)
// {
//   dx = abs(x1-x2)
//   dy = abs(y1-y2)
//   return sqrt(dx*dx, dy*dy)
// }

//helper function: find the closest object in a list to the target.
function findClosestToMe(GameObject, list)
{
  let closestIndex;
  let closestDist;
  for(let i = 0; i < list.length; i++)
    {

      //add offset to list element for mroe randomization+ choose not same targets as friendlies.
      let dist = calcDist(GameObject.x, GameObject.y, list[i].x, list[i].y);
      if(dist < closestDist)
      {
        closestIndex = i;
        closestDist = dist;
      }
    }

  return list[closestIndex];
}
