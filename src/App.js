import React, { useState } from "react";
import PoseDetection from "./MyPoseDetection"; // Your tracking component
import PoseDetectionFromImage from "./PoseDetectionFromImage";
import tree_pose from "./poses/tree_pose.jpeg"; // Example reference image
import warrior_pose from "./poses/warrior_pose.png"; // Example reference image
import side_stretch from "./poses/side_stretch.png"; // Example reference image
import figure_4 from "./poses/figure_4.png"; // Example reference image
import "./App.css";

const yogaPoses = [
  { name: "Tree Pose", value: "tree_pose", image: tree_pose},
  { name: "Warrior Pose", value: "warrior_pose", image: warrior_pose },
  { name: "Side Stretch", value: "side_stretch", image: side_stretch },
  { name: "Figure 4", value: "figure_4", image: figure_4 },
];

const App = () => {
  const [selectedPose, setSelectedPose] = useState(yogaPoses[0]);

  return (
    <div className="container">
      <h1>Chair Yoga Pose Tracker</h1>

      {/* Pose Selection Dropdown */}
      <label>Select a pose:</label>
      <select
        onChange={(e) =>
          setSelectedPose(yogaPoses.find(pose => pose.value === e.target.value))
        }
      >
        {yogaPoses.map((pose) => (
          <option key={pose.value} value={pose.value}>{pose.name}</option>
        ))}
      </select>

      {/* Reference Image with Pose Skeleton */}
      <div className="pose-section">
        <h3>Reference Pose</h3>
        <PoseDetectionFromImage image={selectedPose.image} />
      </div>

      {/* Live Camera Pose Detection */}
      <div className="pose-section mirror">
        <PoseDetection selectedPose={selectedPose.value} />
      </div>
    </div>

  );
};

export default App;
