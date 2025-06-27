import {
  Curve,
  Group,
  Mesh,
  Scene,
  TubeGeometry,
  Vector2,
  Vector3,
} from 'three';
import { generateFollowingPoint } from '../lichtenberg';
import { LightningMaterial } from '../Materials/LightningMaterial';

export function createRandomPoints(
  randAmplitude: number,
  size: number
): Vector2[] {
  const points: Vector2[] = [];

  for (let i = 0; i < size; i++) {
    if (i === 0) {
      points.push(new Vector2(0, 0));
    } else {
      const lastCreatedVector = points[i - 1];
      const newVector = generateFollowingPoint(lastCreatedVector, randAmplitude);
      points.push(newVector);
    }
  }

  return points;
}

export class CustomCurve extends Curve<Vector3> {
  pointSet: Vector2[];

  scale: number;
  // amplitude: number;

  /**
     * We need to map range _R = [0 - 1]_ to values _V = {l0, l1, l2, ..., ln}_
     *
     * - _0_ will always map to _l0_
     *
     * - _1_ will always map to _ln_
     *
     * Having an _r_ value that belogns in _R_, we can get a relative position _p_ by doing:
     *
     * - _p = r * (length(V) - 1)_
     *
     * Since p is not always an integer, we can't look for exactly that position inside _V_,
     * we need to get an intermediate value that:
     *
     * - _pint_ is the integer component of _p_, therefore _pint = floor(p)_ and if p is an integer then _pint = p_
     * - _d_ is the non integer component of _p_, therefore if _p_ is an integer, _d = 0_
     * - The final value must be between _V[pint]_ and _V[pint +1]_ (If _V[pint+1]_ exists)
     * - The final value must be closer to the nearest index value.
     *
     * To map those values we can use the following equations:
     *
     * - _Delta(p) = (V[pint+1] - V[pint])_
     * - _W(r) = V[pint] + Delta(p) * sin(r * PI/2)_
     *
     * */
  getTValueForSet(t: number, set: number[]): number {
    const relativePosition = t * (set.length - 1);
    const intComponent = Math.floor(relativePosition);
    const integerDifference = relativePosition - intComponent;

    const neighborDiff =
      set[Math.min(intComponent + 1, set.length - 1)] - set[intComponent];

    const relativeDisplacement =
      Math.sin((integerDifference * Math.PI) / 2) * neighborDiff; // sin(2xPI/2)m

    return set[intComponent] + relativeDisplacement; // y=msin(2xPI/2)+b
  }

  constructor(scale: number, pointSet: Vector2[]) {
    super();
    this.scale = scale;
    this.pointSet = pointSet;
  }

  getPoint(t: number): Vector3 {
    const xCollection = this.pointSet.map((v) => v.x);
    const yCollection = this.pointSet.map((v) => v.y);
    const xSetValue = this.getTValueForSet(t, xCollection);
    const zSetValue = this.getTValueForSet(t, yCollection);

    const tx = xSetValue;
    const tz = zSetValue;
    const ty = t * this.scale;
    return new Vector3(tx, ty, tz);
  }
}

export function generateCurve(
  scene: Scene | Group,
  pointSet: Vector2[],
  scale: number
) {
  const path = new CustomCurve(scale, pointSet);
  const radius = 0.5;
  const geometry = new TubeGeometry(path, 60, radius, 20, false);

  const tube = new Mesh(geometry, LightningMaterial);

  scene.add(tube);
  return tube;
}
