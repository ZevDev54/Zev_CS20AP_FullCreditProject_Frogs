// let teamCols = ["#9aedb1", "#f09ebf", "#375ac4", "#e8dc9e"]
let frogCap = 400;

class Frog extends GameObject {
  constructor(x, y, rad, spr, parentList, team, size) {
    super(x, y, rad, spr, parentList);

    //MOVEMENT
    this.moveRate = 1000; //in seconds
    this.moveTimer = random(this.moveRate / 2, this.moveRate);
    this.leapForce = 1;

    //RANDOM MOVEMENT POWER
    this.desireStrengthRandom = 100;


    //FOOD AND HUNGER

    this.foodTarget = null;
    this.maxHunger = 1000;
    this.statHunger = this.maxHunger;
    this.increaseRateHunger = 0.015; 

    this.desireStrengthHunger = 600;
    this.distanceFalloffHunger = 0.7

    //SIZE
    this.size = size ? size : 100;
    this.sizeToRadRatio = 0.01;


    //BREEDING
    this.breedingPartner = null;
    this.statBreeding = 0;
    this.maxBreeding = 1000;
    this.percentToBreed = 0.25;

    this.desireStrengthBreeding = 500;
    this.increaseRateBreeding = 0.0075;
    this.distanceFalloffBreeding = 0.7;

    //FIGHTING
    this.fightingTarget = null;
    this.courage = random(0, 1)
    this.desireStrengthFighting = 200;
    this.distanceFalloffFighting = 0.9;
    // this.fearfulnessEffect = -1;
 
    //TEAM
    this.team = team;
    // this.col = teamCols[this.team];

    //HEALTH
    this.maxHealth = this.size;
    this.statHealth = this.maxHealth;
    this.hurtCollisionForce = 0.0;
    this.maxDamageCooldown = 1000;
    this.damageCooldownTimer = 0;

    //DEBUG TRACKERS
    this.dbg_desires_randomVec = createVector(0, 0);
    this.dbg_desires_foodVec = createVector(0, 0);
    this.dbg_desires_breedVec = createVector(0, 0);

    this.dbg_desires_fightingVec = createVector(0, 0)


    


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


    // this.rad = this.size / this.sizeToRadRatio;
    
    this.statBreeding += gameDelta() * this.increaseRateBreeding;

    // this.rad += gameDelta() * this.growthRate * this.hungerReductionRate;

    // this.breedingDesire += gameDelta() * this.increaseRateBreeding;

    this.damageCooldownTimer -= gameDelta();

    this.maxHealth = this.size;
  }

  //welcome to hell
  debugOverlays() {
    textSize(10)
    if(debugLines){
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

    if (this.fightingTarget)
      stroke('red');

    // line(this.x,this.y, this.fightingTarget.x, this.fightingTarget.y)

    line(this.x, this.y, this.x + this.dbg_desires_fightingVec.x, this.y + this.dbg_desires_fightingVec.y)
    {
      text(this.dbg_desires_fightingVec.mag().toFixed(1), this.x + this.dbg_desires_fightingVec.x, this.y + this.dbg_desires_fightingVec.y)
    }
    }


    noStroke()
    fill(0)
    if(debugText)
    {
    text(`hunger: ${this.statHunger.toFixed(1)}/${this.maxHunger.toFixed(1)}`, this.x, this.y - 50)
    text(`statBreeding: ${this.statBreeding.toFixed(1)}/${this.maxBreeding.toFixed(1)}`, this.x, this.y - 35)

    text(`courage: ${this.courage.toFixed(1)}`, this.x, this.y - 65)
    text(`team: ${this.team.toFixed(1)}`, this.x, this.y - 80)


    text(`dmg cooldown: ${this.damageCooldownTimer}`, this.x, this.y - 110)
    }


    if(debugTarget)
    {
      console.log(this.fightingTarget)
      if(this.fightingTarget != null)
      {
      stroke('red')
      line(this.x, this.y, this.fightingTarget.x, this.fightingTarget.y)
      }
    }
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

    this.dbg_desires_fightingVec = this.choices_fighting();
    chosenVector.add(this.dbg_desires_fightingVec.mult(visibilityMultiplier))


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
      let desirePower = calcDesire(rawVec.mag(), 1 - (this.statHunger / this.maxHunger), this.desireStrengthHunger, this.distanceFalloffHunger)

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
      let desirePower = calcDesire(rawVec.mag(), (this.statBreeding / this.maxBreeding), this.desireStrengthBreeding, this.distanceFalloffBreeding)

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
    let closestIndex = -1;
    let closestDist = 100000;
    for (let i = 0; i < frogs.length; i++) {
      if (this.compareTeam(frogs[i]) && this != frogs[i]) {
        let d = dist(this.x, this.y, frogs[i].x, frogs[i].y) < closestDist;
        if (d < closestDist) {
          closestIndex = i;
          d = closestDist;
        }
      }
    }
    if (closestIndex != -1)
      return (frogs[closestIndex]);
    else
      return null;
  }


  choices_fighting() {
    this.fightingTarget = this.findEnemyTarget()

    if (this.fightingTarget) {
      let rawVec = vectorFromTo(this, this.fightingTarget);
      let desirePower = calcDesire(rawVec.mag(), (this.courage), this.desireStrengthFighting, this.distanceFalloffFighting)

      let courageVec = rawVec.normalize().mult(desirePower);
      
      return courageVec.mult(this.calculateFear());

      // let rawVec = vectorFromTo(this, this.foodTarget)
      // let foodDesireMag = rawVec.mag() / (this.hunger/this.maxHunger)

      // return rawVec.normalize().mult(foodDesireMag);
    }
    else {
      return createVector(0, 0);
    }

    // //console.log(findClosestToMe(this, mushrooms));
  }

  calculateFear()
  {
    // return 1; //ebug cuz otehr stuff broken
    
    let courageMultiplier = (1-this.statHealth/this.maxHealth) * this.fearfulnessEffect;
    return courageMultiplier;
  }

  findEnemyTarget() {
    let closestIndex = -1;
    let closestDist = 100000;
    for (let i = 0; i < frogs.length; i++) {
      if (!this.compareTeam(frogs[i]) && this != frogs[i]) {
        let d = dist(this.x, this.y, frogs[i].x, frogs[i].y);
        if (d < closestDist) {
          closestIndex = i;
          closestDist = d;
        }
      }
    }

    if (closestIndex != -1)
      return (frogs[closestIndex]);
    else
      return null;
  }

  compareTeam(frog) {
    return (this.team == frog.team);
  }


  leap(xLeap, yLeap) {
    this.applyForce(xLeap * this.leapForce, yLeap * this.leapForce);
  }

  draw() {
    imageMode(CENTER);
    let sz = (this.size * this.sizeToRadRatio) * this.rad * 2;
    // tint(this.col);  //laggy as hell

    
    // text(`${this.statHealth.toFixed(0)}/${this.maxHealth.toFixed(0)}`,this.x, this.y + 30)
    rectMode(CORNER)

    //Health bar ----
    fill('red')
    rect(this.x - sz/4, this.y + sz/2, (this.statHealth/this.maxHealth) * sz/2, 2)
    

    // fill(this.col) //temp coloring.
    // circle(this.x, this.y, sz)
    
    let w = sz;
    let ratio = w / this.spr.width
    let h = this.spr.height * ratio;

    rectMode(CENTER)

    // image(this.spr, this.x, this.y, w, h);
    image(allFrogSprites[this.team], this.x, this.y, w, h);

    // super.draw();
    // noTint();
  }

  takeDamage(damage)
  {
    this.statHealth -= damage;
    console.log("I took damage!"+this.statHealth)
    
    if(this.statHealth <= 0)
    {
      this.destroy();
    }
  }

  collisionWith(object) {
    super.collisionWith(object)

    if (object instanceof Mushroom) {
      if(this.damageCooldownTimer <= 0)
      {
      // object.destroy();

      object.munch();
      
      this.statHunger += 250;
      this.statHunger = constrain(this.statHunger, 0, this.maxHunger)
      // this.rad += 5;
      this.size += 7;

        this.statHealth += 15;
        this.statHealth = constrain(this.statHealth, 0, this.maxHealth)
        
        this.damageCooldownTimer = this.maxDamageCooldown;
      }
    }

    if (object instanceof Frog) { //FROG COLLISION _________________
      if (this.compareTeam(object)) { //SAME TEAM< CHECK BREEDING_________________
        if ((this.statBreeding / this.maxBreeding) > this.percentToBreed
 && this.statHunger > this.maxHunger / 2) {
          this.statBreeding = 0;
          this.statHunger -= 150;
          breedNewFrog(this, object)
          makeHearticles(this.x, this.y)

        }
      }
      else //DIFFERENT TEAM< CHECK FIGHTING
      {

        if(this.damageCooldownTimer <= 0)
        {
        let differenceVector = this.position().sub(object.position());
         // console.log(differenceVector)

        // console.log(differenceVector.x, " ", differenceVector.y);
        // let force = differenceVector.normalize().mult(this.hurtCollisionForce)
        // this.applyForce(force.x, force.y);
          FightImpact(this,object)

        object.takeDamage(35);
        // this.applyForce()
          
        this.damageCooldownTimer = this.maxDamageCooldown;
      }
      }
    }
  }
}

function FightImpact(object1,object2)
{
  
  let averageX = (object1.x + object2.x)/2;
  let averageY = (object1.y + object2.y)/2;
  let averageSize = (object1.size + object2.size)/2
  console.log(object1.x, object2.x)
  makeImpact(averageX, averageY, averageSize)

}


function breedNewFrog(parent1, parent2) {
  // console.log(parent1.team)
  if(frogs.length >= frogCap)
  {
    console.log("Too many frogs! filed to spawn.")
    return;
  }
  let size = (parent1.size + parent2.size) / 2 * 0.75;
  let sizeConstrained = constrain(size, 50, 500);

  frogs.push(new Frog(
    parent1.x, //position between (x)
    parent2.y, // y
    20, //rad
    frogSprite, // sprite
    frogs, //list
    parent1.team, //team
    sizeConstrained //size
  ));
}

function calcDesire(dist, percentDesire, desireStrength, falloffPow) {
  //stat and max value fields required for below
  // return pow(constrain(-dist, 0, Infinity), falloffPow) + constrain((stat / maxValue), 0, Infinity) * maxDesire;  

  let distSlope = -pow(dist, falloffPow);
  let desireYInt = (percentDesire * desireStrength)

  //console.log("dstAffect: "+distSlope.toFixed(2)+" desireAffect: "+desireYInt.toFixed(2));
  //console.log("Sum is: "+(distSlope+desireYInt).toFixed(2))

  return (constrain(distSlope + desireYInt, 0, Infinity))
  return (distSlope + desireYInt)


  // return constrain(constrain(-pow(dist, falloffPow), 0,Infinity) + percentDesire * desireStrength, 0, Infinity);  

  // //console.log(`Dist: ${dist}, Percent desire: ${percentDesire}, desire strentgh (max): ${desireStrength}, falloffPower: ${falloffPow}`)
  // let smoothedDist = pow(-dist, falloffPow)
  // //console.log("smoothed dist "+smoothedDist)
  // let desireYIntercept = (percentDesire * desireStrength)
  // //console.log("desire y int "+desireYIntercept)
  // //console.log(constrain(smoothedDist + desireYIntercept, 0, Infinity))
  // return constrain(smoothedDist + desireYIntercept, 0, Infinity)

}