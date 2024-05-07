

class Frog extends GameObject
  {
    constructor(x,y,rad,spr, parentList)
    {
      super(x,y,rad,spr, parentList);

      //MOVEMENT
      this.moveRate = 2000; //in seconds
      this.moveTimer = random(this.moveRate/2, this.moveRate);
      this.leapForce = 1;


      //FOOD AND HUNGER
      this.hungerMaxDesire = 10; 
      this.foodTarget = null;
      this.hunger = 2000; 
      this.targetHunger = 1000;
      this.hungerReductionRate = 0.02; //at 0.02, frogs will go hungry in 
      this.growthRate = 0.01; //realtive to hungerReductionRate.

      //BREEDING
      this.maxBreedingDesire = 10000;
      this.breedingDesireGrowthRate = 0.05;
      this.breedingDesire = 0;
      this.breedingPartner = null;


      //DEBUG TRACKERS
      this.dbg_desires_randomVec = createVector(0,0);
      this.dbg_desires_foodVec = createVector(0,0);
      this.dbg_desires_breedVec = createVector(0,0);

    }

    update()
    {
      super.update();
      this.updateNeeds();
      

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


      
      if(debugMode)
      {
        stroke('orange');
        line(this.x, this.y, this.x+this.dbg_desires_randomVec.x, this.y+this.dbg_desires_randomVec.y)
        
        if(this.foodTarget)
        {
          strokeWeight(5);
          
          stroke('blue');
          line(this.x, this.y, this.x+this.dbg_desires_foodVec.x, this.y+this.dbg_desires_foodVec.y)

        }

        if(this.breedingPartner)
        {
          stroke('pink');
          line(this.x, this.y, this.x+this.dbg_desires_breedVec.x, this.y+this.dbg_desires_breedVec.y)
        }

        noStroke()
        text(`hunger: ${this.hunger.toFixed(1)}/${this.targetHunger.toFixed(1)}`, this.x, this.y - 50)
        text(`breeding: ${this.breedingDesire.toFixed(1)}/${this.maxBreedingDesire.toFixed(1)}`, this.x, this.y - 35)
      }

      
    }

    updateNeeds()
    {
      this.hunger -= gameDelta() * this.hungerReductionRate;
      this.rad += gameDelta() * this.growthRate * this.hungerReductionRate;
      
      this.breedingDesire += gameDelta() * this.breedingDesireGrowthRate;

      if(this.hunger <= 0)
      {
        this.destroy();
      }
    }

    
    getChosenDirection()
    {
      let chosenVector = createVector(0,0);

      
      let randomMultiplier = 20;
      let foodMultiplier = 100;
      let breedingMultiplier = 50;
      
      //ALL DESIRES ARE ADDED TO CHOSEN VECTOR THEN NORMALIZED.
      this.dbg_desires_randomVec = this.choices_randomDir().mult(randomMultiplier)
      chosenVector.add(this.dbg_desires_randomVec);
      this.dbg_desires_foodVec = this.choices_hunger().mult(foodMultiplier)
      chosenVector.add(this.dbg_desires_foodVec);
      this.dbg_desires_breedVec = this.choices_breeding().mult(breedingMultiplier);
      chosenVector.add(this.dbg_desires_breedVec)

      
      return chosenVector.normalize();
    }

    choices_randomDir()
    {
      return createVector(random(-1,1), random(-1,1))
    }

    choices_hunger()
    {
      this.foodTarget = this.findFoodTarget()
      
      if(this.foodTarget)
      {
        let rawVec = vectorFromTo(this, this.foodTarget)
        let foodDesireMag = rawVec.mag() / (this.hunger/this.maxHunger)
        return rawVec.normalize().mult(foodDesireMag);
      }
      else
      {
        return createVector(0,0);
      }
      
      // console.log(findClosestToMe(this, mushrooms));
    }

    findFoodTarget()
    {
      return findClosestToMe(this, mushrooms);
    }

    choices_breeding()
    {
      this.breedingPartner = this.findBreedingPartner()
      console.log(this.breedingPartner)

      if(this.breedingPartner)
      {
        let rawVec = vectorFromTo(this, this.breedingPartner)
        console.log(rawVec)
        
        
        let breedDesireMag = log(rawVec.mag()) * (this.breedingDesire / this.maxBreedingDesire)
        console.log(breedDesireMag);
        return rawVec.normalize().mult(breedDesireMag);
      }
      else
      {
        return createVector(0,0);
      }

      // console.log(findClosestToMe(this, mushrooms));
    }

    findBreedingPartner()
    {
      return findClosestToMe(this, frogs);
    }
    

    
    leap(xLeap, yLeap)
    {
      this.applyForce(xLeap * this.leapForce, yLeap * this.leapForce);
    }

    collisionWith(object)
    {
      super.collisionWith(object)
      
      if(object instanceof Mushroom)
      {
        object.destroy();
        this.hunger += 500;
      }

      if(object instanceof Frog)
      {
        if(this.breedingDesire > this.maxBreedingDesire/4)
        {
           this.breedingDesire = 0;
          breedNewFrog(this, object)
         
        }
      }
    }
  }

function breedNewFrog(parent1, parent2)
{
  frogs.push(new Frog(
    parent1.x, //position between (x)
    parent2.y, // y
    (parent1.rad+parent2.rad)/2*0.5, //Radius is a fifth of the average size of parents 
    frogSprite,
    frogs
            ))
}