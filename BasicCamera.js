//current x/y positions
let camX = 0;
let camY = 0;

//target x/y positions: where the camera will be lerped to.
let targetCamX = 0;
let targetCamY = 0;
//rate which actual position is lerped to get to the target position.
let camLerpSpeed = 0.2;


let moveCamWithKeys = true;
//Cam moving speed using WASD or arrow keys
let camPanSpeed = 8;



//current zoom level, smaller number means more zoomed out
let camZoom = 1;
//The zoom level that camZoom will be lerped to 
let camZoomTarget = 1;
//Amount that each zoom 'click' affects the camera.
let camZoomStep = 0.05;
//rate over time to smoothly interpolate to the target zoom level
let camZoomLerpSpeed = 0.1;


//MUST be called from the main draw(), BEFORE other drawing! (at top of block)
//UI can be done by putting UI draw calls BEFORE the UpdateCamera() function.

// (well i think it has to be that way)
function UpdateCamera()
{
  if(moveCamWithKeys)
  {
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    targetCamY -= camPanSpeed;
  }
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    targetCamX -= camPanSpeed;

  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    targetCamX += camPanSpeed;

  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    targetCamY += camPanSpeed;

  }
  }

  //move the camera position smoothly to the target position
  camX = lerp(camX, targetCamX, camLerpSpeed)
  camY = lerp(camY, targetCamY, camLerpSpeed)

  

  
  //translate applies the movement. 
  //Using negative because it is flipped by default 
  //and this makes my brain hurt less

  translate(-camX, -camY)

  //Smoothly interpoate between current zoom level and target zoom level
  camZoom = lerp(camZoom, camZoomTarget, camZoomLerpSpeed)
  scale(camZoom)

  //current problem: target is not centered in the screen. Find some math to position the camera so that the camera appears to zoom into the center.
}

function mouseWheel(event) {
  if (event.delta > 0) {
    camZoomTarget -= camZoomStep;
    camZoomTarget = constrain(camZoomTarget,0.4, 5)
  } else {
    camZoomTarget += camZoomStep;
    camZoomTarget = constrain(camZoomTarget,0.4, 5)
  }
  // Uncomment to prevent any default behavior.
  // return false;
}

function followCam(x,y)
{
  targetCamX = x;
  targetCamY = y;
}

//world-space position of mouseX. Use instead of mouseX.
function worldMouseX()
{
  return (mouseX+camX)/camZoom;
}
//world-space position of mouseX. Use instead of mouseX.

function worldMouseY()
{
  return (mouseY+camY)/camZoom
}