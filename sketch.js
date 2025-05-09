// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // Circle position
let circleSize = 100; // Circle size

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Initialize circle position in the center of the canvas
  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Draw the circle
  fill(0, 0, 255, 150); // Semi-transparent blue
  noStroke();
  circle(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Check if the index finger (keypoint 8) touches the circle
        let indexFinger = hand.keypoints[8];
        let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        if (d < circleSize / 2) {
          // Move the circle to the index finger's position
          circleX = indexFinger.x;
          circleY = indexFinger.y;
        }

        // Draw lines connecting keypoints in groups
        drawLines(hand.keypoints, 0, 4);  // Connect keypoints 0-4
        drawLines(hand.keypoints, 5, 8);  // Connect keypoints 5-8
        drawLines(hand.keypoints, 9, 12); // Connect keypoints 9-12
        drawLines(hand.keypoints, 13, 16); // Connect keypoints 13-16
        drawLines(hand.keypoints, 17, 20); // Connect keypoints 17-20
      }
    }
  }
}

// Helper function to draw lines between consecutive keypoints in a range
function drawLines(keypoints, start, end) {
  stroke(0, 255, 0); // Set line color
  strokeWeight(2); // Set line thickness
  for (let i = start; i < end; i++) {
    let kp1 = keypoints[i];
    let kp2 = keypoints[i + 1];
    line(kp1.x, kp1.y, kp2.x, kp2.y);
  }
}
