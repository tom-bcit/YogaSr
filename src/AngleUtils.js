const calculateAngle = (point1, point2, point3) => {
  const vector1 = [point1.x - point2.x, point1.y - point2.y];
  const vector2 = [point3.x - point2.x, point3.y - point2.y];

  const dotProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1];
  const magnitude1 = Math.sqrt(vector1[0] ** 2 + vector1[1] ** 2);
  const magnitude2 = Math.sqrt(vector2[0] ** 2 + vector2[1] ** 2);

  const cosTheta = dotProduct / (magnitude1 * magnitude2);
  const angle = Math.acos(cosTheta); // angle in radians

  return (angle * 180) / Math.PI; // Convert radians to degrees
};

const returnAngleDictionary = (keypoints) => {
  const angleDictionary = {
    leftHip: calculateAngle(keypoints.leftShoulder, keypoints.leftHip, keypoints.leftKnee),
    rightHip: calculateAngle(keypoints.rightShoulder, keypoints.rightHip, keypoints.rightKnee),
    leftKnee: calculateAngle(keypoints.leftHip, keypoints.leftKnee, keypoints.leftAnkle),
    rightKnee: calculateAngle(keypoints.rightHip, keypoints.rightKnee, keypoints.rightAnkle),
    leftShoulder: calculateAngle(keypoints.leftElbow, keypoints.leftShoulder, keypoints.leftHip),
    rightShoulder: calculateAngle(keypoints.rightElbow, keypoints.rightShoulder, keypoints.rightHip),
    leftElbow: calculateAngle(keypoints.leftShoulder, keypoints.leftElbow, keypoints.leftWrist),
    rightElbow: calculateAngle(keypoints.rightShoulder, keypoints.rightElbow, keypoints.rightWrist)
  };

  return angleDictionary;
};

const compareAngles = (CameraPoseAngle, ModelPoseAngle) => {
  const angleThreshold = 10; // degrees

  if (CameraPoseAngle > ModelPoseAngle + angleThreshold) {
    return 1; // "Over-extended"
  } else if (CameraPoseAngle < ModelPoseAngle - angleThreshold) {
    return -1; // "Under-extended"
  } else {
    return 0; // "Correct"
  }
};