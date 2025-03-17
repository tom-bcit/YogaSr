import React, { useState } from "react";
import PoseDetection from "./MyPoseDetection"; // Your tracking component
import PoseDetectionFromImage from "./PoseDetectionFromImage";
import tree_pose from "./poses/tree_pose.jpeg"; // Example reference image
import warrior_pose from "./poses/warrior_pose.png"; // Example reference image
import side_stretch from "./poses/side_stretch.png"; // Example reference image
import figure_4 from "./poses/figure_4.png"; // Example reference image
import "./App.css";

const yogaPoses = [
  { name: "Tree Pose", value: "tree_pose", image: tree_pose },
  { name: "Warrior Pose", value: "warrior_pose", image: warrior_pose },
  { name: "Side Stretch", value: "side_stretch", image: side_stretch },
  { name: "Figure 4", value: "figure_4", image: figure_4 },
];


const App = () => {
  const [selectedPose, setSelectedPose] = useState(yogaPoses[0]);

  const handlePoseChange = (pose) => {
    setSelectedPose(pose);
  };
  
  return (
    <div className="container">
      <h1>Chair Yoga Pose Tracker</h1>

      {/* Pose Selection Dropdown */}
      <div className="pose-toggle-buttons">
        {yogaPoses.map((pose) => (
          <button
            key={pose.value}
            onClick={() => handlePoseChange(pose)}
            className={`pose-button ${selectedPose.value === pose.value ? "active" : ""}`}
          >
            {pose.name}
          </button>
        ))}
      </div>

      {/* Reference Image with Pose Skeleton */}
      <div className="pose-container">
        <div className="pose-section">
          <h3>Reference Pose</h3>
          <PoseDetectionFromImage image={selectedPose.image} />
        </div>

        {/* Live Camera Pose Detection */}
        <div className="pose-section">
          <h3>Live Pose Detection</h3>
          <div className="mirror">
            <PoseDetection/>
          </div>
        </div>
      </div>
    </div>

  );
};

export default App;
