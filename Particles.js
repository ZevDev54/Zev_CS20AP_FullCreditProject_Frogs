let particlesList = [];

function updateImpacts(){
  // console.log("Updatign paritcles!")
  for(let i = 0; i < particlesList.length; i++)
    {
      // particlesList[i].update();
      if(particlesList[i].destroyMe)
      {
        particlesList.splice(i,1)

        i--
      }
      else
      {
        particlesList[i].update()
        // console.log("shits going down")

      }
    }
}


function makeImpact(x,y, size)
{
  // console.log("Making impact");
  particlesList.push(new Impact(x,y,size,2000));
}
class Impact
  {
    constructor(x, y, rad, lifeTime)
    {
      this.x = x;
      this.y = y;
      this.rad = rad;
      this.lifeTime = lifeTime;

      this.lerpSpeed = 0.15;

      this.destroyMe = false;
      // console.log("Impact constrcuted!!");

    }

    update()
    {
      // console.log("Impact drawng!");

      this.rad = lerp(this.rad, 0, this.lerpSpeed);

      let w = this.rad;
      let ratio = w / impactSprite.width
      let h = impactSprite.height * ratio;

      image(impactSprite, this.x, this.y, w, h);
      // circle(this.x,this.y, 1000)

      if(this.lifeTime > 0){
        this.lifeTime -= gameDelta();
      }
      else{
        this.destroyMe = true;
      }
    }


  }



function makeHearticles(x,y)
{
  // console.log("Making impact");
  particlesList.push(new Hearticles(x,y, 30, 5, 3000));
}

class Hearticles
  {
    constructor(x, y, rad, hearticleCount, lifeTime)
    {
      this.x = x;
      this.y = y;
      this.rad = rad;
      this.lifeTime = lifeTime;

      this.explosiveness;
      this.hearticleCount = hearticleCount;

      this.hearticleCoords = [];
      this.heartRadius = 0.3;

      this.randomness = 2;
      
      this.lerpSpeed = 0.03;

      this.destroyMe = false;
      // console.log("Impact constrcuted!!");

      for(let i = 0; i < this.hearticleCount; i++)
        {
      this.hearticleCoords.push(createVector(-this.heartRadius, this.heartRadius));
        }

    }

    update()
    {
      // console.log("Impact drawng!");

      this.rad = lerp(this.rad, 0, this.lerpSpeed);

      
      for(let i = 0; i < this.hearticleCount; i++)
        {
          let x = this.hearticleCoords[i].x
          let y = this.hearticleCoords[i].y

          x += random(-this.randomness, this.randomness)
          y += random(-this.randomness, this.randomness)

          
          let w = this.rad;
          let ratio = w / heartSprite.width
          let h = heartSprite.height * ratio;
          
           image(heartSprite, this.x + x, this.y + y, w,h) 

          this.hearticleCoords[i].x = x;
          this.hearticleCoords[i].y = y;
        }

      
      if(this.lifeTime > 0){
        this.lifeTime -= gameDelta();
      }
      else{
        this.destroyMe = true;
      }
    }


  }

