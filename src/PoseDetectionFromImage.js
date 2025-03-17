import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";

const PoseDetectionFromImage = ({ image, size = 500 }) => {
  const canvasRef = useRef(null);
  const [detectedPose, setDetectedPose] = useState(null);

  useEffect(() => {
    const detectPoseFromImage = async () => {
      await tf.ready();
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet
      );

      const img = new Image();
      img.src = image;
      img.onload = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // Set canvas size to match image display size
        canvas.width = size;
        canvas.height = size;

        // Get actual image size
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Detect poses
        const poses = await detector.estimatePoses(img);
        setDetectedPose(poses[0]);

        if (poses.length > 0) {
          const keypoints = poses[0].keypoints.map((keypoint) => ({
            ...keypoint,
            x: (keypoint.x / imgWidth) * size, // Scale X
            y: (keypoint.y / imgHeight) * size, // Scale Y
          }));

          drawKeypoints(ctx, keypoints);
        }
      };
    };

    detectPoseFromImage();
  }, [image, size]);

  const drawKeypoints = (ctx, keypoints) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.3) {
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
  };

  return (
    <div className="pose-detection-img">
      <img src={image} alt="Reference Pose" className="pose-image" />
      <canvas ref={canvasRef} className="skeleton-canvas" />
    </div>
  );
};

export default PoseDetectionFromImage;
