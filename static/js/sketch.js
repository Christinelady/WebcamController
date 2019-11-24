const socket = io();

let canvas;
var capture;
var tracker;
var w = 320,
    h = 240;

var faceDetected = false;
var canDetectFace = true;

function setup() {
  canvas = createCanvas(800, 800);//the size of the whole canvas
  //canvas.elt.style.transform = 'scale(-1, 1)';
  canvas.elt.style.transform = 'scale(-1, 1)';//画布左右对称
  background(0);
  makeWebcam();
  colorMode(HSB);
}

function makeWebcam() {
  capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
     }, function() {
     console.log('capture ready.')
  });

  capture.elt.setAttribute('playsinline', '');
  capture.size(320, 240);
  capture.hide();
  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);
}

function draw() {
  if (frameCount % 10 === 0) {
    if (canDetectFace) {
      var positions = tracker.getCurrentPosition();

      if (positions.length > 0 && faceDetected == false){
        faceDetected = true;

        // ellipse(positions[62][0], positions[62][1], 10, 10);
        onFaceDetected(positions[62][0])
      }
      else if (!positions) {
        faceDetected = false;
        console.log("no face");
      }
      else {
        console.log("Face already detected")
      }
    }
  }
}

function onFaceDetected(faceCenterX) {
  var side = round(map(faceCenterX, 0, w, 0, 1));

  // 0 left
  // 1 right

  canDetectFace = false;
  socket.emit('face_detected', side);
}

socket.on('ready', function(results) {
  canDetectFace = true;
  faceDetected = false;
});
