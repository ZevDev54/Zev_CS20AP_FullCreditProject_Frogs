

class Mushroom extends GameObject
  {
    constructor(x,y,rad,spr,parentList)
    {
      super(x,y,rad,spr,parentList);
      this.isStatic = true;
      this.bitesRemaining = 3;
    }

    munch()
    {
      this.bitesRemaining -= 1;
      if(this.bitesRemaining <= 0)
        this.destroyMe = true;
    }

    update()
    {
      super.update()
      if(debugMode)
      {
        fill(0)
        text(this.bitesRemaining, this.x, this.y + this.rad * 2,5)
      }
    }

    
  }