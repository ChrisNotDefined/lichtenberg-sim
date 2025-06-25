import { Vector2 } from 'three';

export interface LicktembergPoint {
  point: Vector2;
  branch?: LicktembergPoint[];
}

export function createLichtenbergPaths(depth: number = 0) {
  const branch: LicktembergPoint[] = [
    {
      point: new Vector2(0, 0),
    },
  ];

  
}

export function generateFollowingPoint(
  lastCreatedVector: Vector2,
  randAmplitude: number
) {
  const newVector = lastCreatedVector.clone();
  newVector.x += -randAmplitude + Math.random() * 2 * randAmplitude;
  newVector.y += -randAmplitude + Math.random() * 2 * randAmplitude;
  return newVector;
}
