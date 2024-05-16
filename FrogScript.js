let teamCols = ["#37c45d", "#c43770", "#375ac4", "#d1b528"]

class Frog extends GameObject {
  constructor(x, y, rad, spr, parentList, team) {
    super(x, y, rad, spr, parentList);

    //MOVEMENT
    this.moveRate = 1500; //in seconds
    this.moveTimer = random(this.moveRate / 2, this.moveRate);
    this.leapForce = 1;

    //RANDOM MOVEMENT POWER
    this.desireStrengthRandom = 200;
    

    //FOOD AND HUNGER

    this.foodTarget = null;
    this.maxHunger = 1000;
    this.statHunger = this.maxHunger;
    this.increaseRateHunger = 0.0075; //at 0.02, frogs will go hungry in 

    this.desireStrengthHunger = 1000;
    this.distanceFalloffHunger = 0.7


    //BREEDING
    this.breedingPartner = null;
    this.statBreeding = 0;
    this.maxBreeding = 1000;

    this.desireStrengthBreeding = 500;
    this.increaseRateBreeding = 0.0075;
    this.distanceFalloffBreeding =  0.7;


    //TEAM
    this.team = team ? team : 0;


    //DEBUG TRACKERS
    this.dbg_desires_randomVec = createVector(0, 0);
    this.dbg_desires_foodVec = createVector(0, 0);
    this.dbg_desires_breedVec = createVector(0, 0);


    
  }

  update() {
    super.update();
    this.updateNeeds();
    this.moveLoop();

    if (debugMode) {
      this.debugOverlays();
    }
  }

  moveLoop() {
    if (this.moveTimer > 0) {
      ////console.log(this.moveTimer)
      ////console.log(gameDelta())
      this.moveTimer -= gameDelta();
    }
    else {
      let moveVec = this.getChosenDirection();
      this.leap(moveVec.x, moveVec.y)

      this.moveTimer = random(this.moveRate / 2, this.moveRate);
    }
  }
  updateNeeds() {
    this.statHunger -= gameDelta() * this.increaseRateHunger;
    if (this.statHunger <= 0) {
      this.destroy();
    }

    this.statBreeding += gameDelta() * this.increaseRateBreeding;

    // this.rad += gameDelta() * this.growthRate * this.hungerReductionRate;

    // this.breedingDesire += gameDelta() * this.increaseRateBreeding;


  }
  debugOverlays() {
    stroke('orange');
    line(this.x, this.y, this.x + this.dbg_desires_randomVec.x, this.y + this.dbg_desires_randomVec.y)

    noStroke();
    text(this.dbg_desires_randomVec.mag().toFixed(1), this.x + this.dbg_desires_randomVec.x, this.y + this.dbg_desires_randomVec.y)

    if (this.foodTarget) {
      strokeWeight(5);

      stroke('blue');
      line(this.x, this.y, this.x + this.dbg_desires_foodVec.x, this.y + this.dbg_desires_foodVec.y)

      noStroke();
      text(this.dbg_desires_foodVec.mag().toFixed(1), this.x + this.dbg_desires_foodVec.x, this.y + this.dbg_desires_foodVec.y)
    }

    if (this.breedingPartner) {
      stroke('pink');
      line(this.x, this.y, this.x + this.dbg_desires_breedVec.x, this.y + this.dbg_desires_breedVec.y)

      noStroke();
      text(this.dbg_desires_breedVec.mag().toFixed(1), this.x + this.dbg_desires_breedVec.x, this.y + this.dbg_desires_breedVec.y)
    }

    noStroke()
    text(`hunger: ${this.statHunger.toFixed(1)}/${this.maxHunger.toFixed(1)}`, this.x, this.y - 50)
    text(`statBreeding: ${this.statBreeding.toFixed(1)}/${this.maxBreeding.toFixed(1)}`, this.x, this.y - 35)
  }


  getChosenDirection() {
    let chosenVector = createVector(0, 0);

    let visibilityMultiplier = 1;

    //ALL DESIRES ARE ADDED TO CHOSEN VECTOR THEN NORMALIZED.
    this.dbg_desires_randomVec = this.choices_randomDir()
    chosenVector.add(this.dbg_desires_randomVec.mult(visibilityMultiplier));
    
    this.dbg_desires_foodVec = this.choices_hunger()
    chosenVector.add(this.dbg_desires_foodVec.mult(visibilityMultiplier));
    
    this.dbg_desires_breedVec = this.choices_breeding();
    chosenVector.add(this.dbg_desires_breedVec.mult(visibilityMultiplier))


    return chosenVector.normalize();
  }

  choices_randomDir() {
    return createVector(random(-1, 1), random(-1, 1)).mult(this.desireStrengthRandom)
  }

  choices_hunger() {
    this.foodTarget = this.findFoodTarget()

    if (this.foodTarget) {
      let rawVec = vectorFromTo(this, this.foodTarget);
      // //console.log(1-(this.statHunger/this.maxHunger))
      let desirePower = calcDesire(rawVec.mag(), 1-(this.statHunger/this.maxHunger), this.desireStrengthHunger, this.distanceFalloffHunger)

      //console.log("Food desire power is:"+desirePower)
      return rawVec.normalize().mult(desirePower);

      // let rawVec = vectorFromTo(this, this.foodTarget)
      // let foodDesireMag = rawVec.mag() / (this.hunger/this.maxHunger)

      // return rawVec.normalize().mult(foodDesireMag);
    }
    else {
      return createVector(0, 0);
    }

    // //console.log(findClosestToMe(this, mushrooms));
  }

  findFoodTarget() {
    return findClosestToMe(this, mushrooms);
  }

  choices_breeding() {
    this.breedingPartner = this.findBreedingPartner()

    if (this.breedingPartner) {
      let rawVec = vectorFromTo(this, this.breedingPartner);
      let desirePower = calcDesire(rawVec.mag(), (this.statBreeding/this.maxBreeding), this.desireStrengthBreeding, this.distanceFalloffBreeding)

      return rawVec.normalize().mult(desirePower);

      // let rawVec = vectorFromTo(this, this.foodTarget)
      // let foodDesireMag = rawVec.mag() / (this.hunger/this.maxHunger)

      // return rawVec.normalize().mult(foodDesireMag);
    }
    else {
      return createVector(0, 0);
    }

    // //console.log(findClosestToMe(this, mushrooms));
  }



  findBreedingPartner() {
    return findClosestToMe(this, frogs);
  }



  leap(xLeap, yLeap) {
    this.applyForce(xLeap * this.leapForce, yLeap * this.leapForce);
  }

  draw()
  {
    super.draw();
    tint(teamCols[this.team]);
  }

  collisionWith(object) {
    super.collisionWith(object)

    if (object instanceof Mushroom) {
      object.destroy();
      this.statHunger += 250;
      this.statHunger = constrain(this.statHunger, 0, this.maxHunger)
      this.rad += 5;
    }

    if (object instanceof Frog) {
      if (this.statBreeding > this.maxBreeding / 2 && this.statHunger > this.maxHunger/2) {
        this.statBreeding = 0;
        this.statHunger -= 150;
        breedNewFrog(this, object)

      }
    }
  }
}



function breedNewFrog(parent1, parent2) {
  frogs.push(new Frog(
    parent1.x, //position between (x)
    parent2.y, // y
    constrain( (parent1.rad + parent2.rad) / 2 * 0.75,
              10,
              100
              ), 
    frogSprite,
    frogs
  ))
}

function calcDesire(dist, percentDesire, desireStrength, falloffPow) {
  //stat and max value fields required for below
  // return pow(constrain(-dist, 0, Infinity), falloffPow) + constrain((stat / maxValue), 0, Infinity) * maxDesire;  

  let distSlope = -pow(dist, falloffPow);
  let desireYInt =(percentDesire * desireStrength)

  //console.log("dstAffect: "+distSlope.toFixed(2)+" desireAffect: "+desireYInt.toFixed(2));
  //console.log("Sum is: "+(distSlope+desireYInt).toFixed(2))

  return(constrain(distSlope + desireYInt, 0, Infinity))
  
  // return constrain(constrain(-pow(dist, falloffPow), 0,Infinity) + percentDesire * desireStrength, 0, Infinity);  

  // //console.log(`Dist: ${dist}, Percent desire: ${percentDesire}, desire strentgh (max): ${desireStrength}, falloffPower: ${falloffPow}`)
  // let smoothedDist = pow(-dist, falloffPow)
  // //console.log("smoothed dist "+smoothedDist)
  // let desireYIntercept = (percentDesire * desireStrength)
  // //console.log("desire y int "+desireYIntercept)
  // //console.log(constrain(smoothedDist + desireYIntercept, 0, Infinity))
  // return constrain(smoothedDist + desireYIntercept, 0, Infinity)

}