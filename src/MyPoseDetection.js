import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";

// Example predefined yoga poses for comparison (you can expand this)
const yogaPoses = {
  "Mountain Pose": { keypoints: ["left_shoulder", "right_shoulder", "left_hip", "right_hip"] },
  "Tree Pose": { keypoints: ["left_ankle", "right_ankle", "left_knee", "right_knee", "left_shoulder", "right_shoulder"] },
  // Add more poses as necessary
};

const PoseDetection = ({ selectedPose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedPose, setDetectedPose] = useState(null);

  useEffect(() => {
    const setupCamera = async () => {
      await tf.ready();
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet
      );
  
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        console.error("Video or canvas element not found!");
        return;
      }
  
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
  
      // Ensure video is loaded before setting canvas size
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play().then(() => {
            // Set canvas size to match video size
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            resolve();
          });
        };
      });
  
      const detectPose = async () => {
        if (!video || video.readyState < 2) {
          requestAnimationFrame(detectPose);
          return;
        }
  
        try {
          const poses = await detector.estimatePoses(video);
          setDetectedPose(poses[0]);  // Assume only one person is detected
          drawKeypoints(poses);
        } catch (error) {
          console.error("Pose detection error:", error);
        }
  
        requestAnimationFrame(detectPose);
      };
  
      detectPose();
    };
  
    setupCamera();
  }, [selectedPose]);
  
  const drawKeypoints = (poses) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame
  
    poses.forEach((pose) => {
      const keypoints = pose.keypoints;
  
      // Draw keypoints (dots)
      keypoints.forEach((keypoint) => {
        if (keypoint.score > 0.3) { // Confidence threshold
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      });
  
      const keypointConnections = [
        ["nose", "left_eye"], ["nose", "right_eye"],
        ["left_eye", "left_ear"], ["right_eye", "right_ear"],
        ["left_shoulder", "right_shoulder"],
        ["left_shoulder", "left_elbow"], ["left_elbow", "left_wrist"],
        ["right_shoulder", "right_elbow"], ["right_elbow", "right_wrist"],
        ["left_shoulder", "left_hip"], ["right_shoulder", "right_hip"],
        ["left_hip", "right_hip"],
        ["left_hip", "left_knee"], ["left_knee", "left_ankle"],
        ["right_hip", "right_knee"], ["right_knee", "right_ankle"]
      ];

      // Draw skeleton (lines)
      keypointConnections.forEach(([p1, p2]) => {
        const point1 = keypoints.find(k => k.name === p1);
        const point2 = keypoints.find(k => k.name === p2);
  
        if (point1 && point2 && point1.score > 0.3 && point2.score > 0.3) {
          ctx.beginPath();
          ctx.moveTo(point1.x, point1.y);
          ctx.lineTo(point2.x, point2.y);
          ctx.strokeStyle = "blue";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });
    });
    
    if (detectedPose && selectedPose) {
      comparePoses(detectedPose, selectedPose); // Compare the pose to the selected pose
    }
  };

  // Compare the detected pose with the selected pose
  const comparePoses = (detectedPose, selectedPose) => {
    if (!yogaPoses[selectedPose]) return;

    const targetPose = yogaPoses[selectedPose];
    const detectedKeypoints = detectedPose.keypoints;

    targetPose.keypoints.forEach((keypointName) => {
      const detectedPoint = detectedKeypoints.find(k => k.name === keypointName);
      if (detectedPoint && detectedPoint.score > 0.5) {
        console.log(`${keypointName} detected in position`);
      }
    });
  };

  return (
    <div class="pose-detection-vid">
      <video
        ref={videoRef}
        style={{
          position: "absolute"
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute"
        }}
      />
    </div>
  );
};

export default PoseDetection;
