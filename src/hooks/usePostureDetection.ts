import { useState, useEffect, useRef, useCallback } from 'react';
import { Pose, Results } from '@mediapipe/pose';

interface PostureAnalysis {
  isGoodPosture: boolean;
  isLookingAtCamera: boolean;
  headTiltAngle: number;
  shoulderAlignment: number;
  confidence: number;
  warnings: string[];
}

export const usePostureDetection = (videoElement: HTMLVideoElement | null, isActive: boolean) => {
  const [postureAnalysis, setPostureAnalysis] = useState<PostureAnalysis>({
    isGoodPosture: true,
    isLookingAtCamera: true,
    headTiltAngle: 0,
    shoulderAlignment: 0,
    confidence: 0,
    warnings: []
  });

  const poseRef = useRef<Pose | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const analyzePosture = useCallback((results: Results) => {
    if (!results.poseLandmarks) {
      return;
    }

    const landmarks = results.poseLandmarks;
    const warnings: string[] = [];
    
    // Key landmark indices
    const nose = landmarks[0];
    const leftEye = landmarks[2];
    const rightEye = landmarks[5];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftEar = landmarks[7];
    const rightEar = landmarks[8];

    // Calculate head tilt angle
    const headTiltAngle = Math.atan2(
      rightEye.y - leftEye.y,
      rightEye.x - leftEye.x
    ) * (180 / Math.PI);

    // Check if looking at camera (nose should be between eyes)
    const noseXCenter = (leftEye.x + rightEye.x) / 2;
    const horizontalDeviation = Math.abs(nose.x - noseXCenter);
    const isLookingAtCamera = horizontalDeviation < 0.05;

    if (!isLookingAtCamera) {
      warnings.push('Please look directly at the camera');
    }

    // Check shoulder alignment
    const shoulderAlignment = Math.abs(leftShoulder.y - rightShoulder.y);
    const isShoulderAligned = shoulderAlignment < 0.05;

    if (!isShoulderAligned) {
      warnings.push('Keep your shoulders level');
    }

    // Check head position (should be upright)
    const isHeadUpright = Math.abs(headTiltAngle) < 15;
    
    if (!isHeadUpright) {
      warnings.push('Keep your head straight');
    }

    // Check if too close or too far
    const faceSize = Math.abs(leftEye.x - rightEye.x);
    const isTooClose = faceSize > 0.3;
    const isTooFar = faceSize < 0.1;

    if (isTooClose) {
      warnings.push('Move back from the camera');
    } else if (isTooFar) {
      warnings.push('Move closer to the camera');
    }

    // Check posture (ears should be roughly above shoulders)
    const avgEarY = (leftEar.y + rightEar.y) / 2;
    const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const isGoodPosture = (avgEarY < avgShoulderY) && Math.abs(avgEarY - avgShoulderY) > 0.1;

    if (!isGoodPosture) {
      warnings.push('Sit up straight - maintain good posture');
    }

    // Overall confidence based on landmark visibility
    const visibleLandmarks = landmarks.filter(l => l.visibility && l.visibility > 0.5).length;
    const confidence = (visibleLandmarks / landmarks.length) * 100;

    setPostureAnalysis({
      isGoodPosture,
      isLookingAtCamera,
      headTiltAngle,
      shoulderAlignment,
      confidence,
      warnings
    });
  }, []);

  useEffect(() => {
    if (!videoElement || !isActive) {
      return;
    }

    const initPose = async () => {
      const pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      pose.onResults(analyzePosture);

      poseRef.current = pose;

      // Manual frame processing loop
      const processFrame = async () => {
        if (poseRef.current && videoElement.readyState >= 2) {
          await poseRef.current.send({ image: videoElement });
        }
        animationFrameRef.current = requestAnimationFrame(processFrame);
      };

      processFrame();
    };

    initPose();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [videoElement, isActive, analyzePosture]);

  return postureAnalysis;
};
