
import React, { useRef, useEffect } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';

const PoseDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const setupCamera = async () => {
      // Load TensorFlow.js and Pose Detection model
      await tf.ready();
      const model = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);

      // Access the webcam
      const video = videoRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.play();

      // Get canvas context for drawing
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Detect poses and draw them on canvas
      const detectPose = async () => {
        const poses = await model.estimatePoses(video);

        // Clear previous frame
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw detected keypoints and skeletons
        poses.forEach(pose => {
          pose.keypoints.forEach(keypoint => {
            if (keypoint.score > 0.5) {
              context.beginPath();
              context.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
              context.fillStyle = 'red';
              context.fill();
            }
          });
        });

        requestAnimationFrame(detectPose);
      };

      detectPose();
    };

    setupCamera();
  }, []);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" />
      <canvas ref={canvasRef} width="640" height="480" />
    </div>
  );
};

export default PoseDetection;
