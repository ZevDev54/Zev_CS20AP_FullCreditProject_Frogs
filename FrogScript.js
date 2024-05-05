

class Frog extends GameObject
  {
    constructor(x,y,rad,spr)
    {
      super(x,y,rad,spr);

      this.moveRate = 2000; //in seconds
      this.moveTimer = random(this.moveRate/2, this.moveRate);

      this.leapForce = 1;
    }

    update()
    {
      super.update();
      

      if(this.moveTimer > 0)
      {
        //console.log(this.moveTimer)
        //console.log(gameDelta())
        this.moveTimer -= gameDelta();
      }
      else
      {
        let moveVec = this.getChosenDirection();
        this.leap(moveVec.x, moveVec.y)

        this.moveTimer = random(this.moveRate/2, this.moveRate);
      }
    }

    getChosenDirection()
    {
      let chosenVector = createVector(0,0);

      chosenVector.add(this.choices_randomDir())
      this.choices_hunger()
      
      return chosenVector.normalize();
    }

    choices_randomDir()
    {
      return createVector(random(-1,1), random(-1,1))
    }

    choices_hunger()
    {
      // console.log(findClosestToMe(this, mushrooms));
    }
    
    leap(xLeap, yLeap)
    {
      this.applyForce(xLeap * this.leapForce, yLeap * this.leapForce);
    }

    collide(otherBodies)
    {
      super.collide(otherBodies);

      
    }
  }