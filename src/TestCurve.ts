import {
  Curve,
  Mesh,
  MeshPhongMaterial,
  Scene,
  TubeGeometry,
  Vector3,
} from 'three';

type CustomVector = Vector3;

export class TestCurve extends Curve<CustomVector> {
  xPointSet: number[];
  zPointSet: number[];

  scale: number;
  amplitude: number;

  createRandomSet(): number[] {
    return new Array(10).fill(1).map((_, idx) => {
      if (idx === 0) return 0;
      return (
        -this.amplitude + Math.random() * (this.amplitude + this.amplitude)
      );
    });
  }

  getTValueForSet(t: number, set: number[]): number {
    /**
     * We need to map range _R = [0 - 1]_ to values _V = {l0, l1, l2, ..., ln}_
     * 
     * - _0_ will always map to _l0_
     * 
     * - _1_ will always map to _ln_
     *
     * Having an _r_ value that belogns in _R_, we can get a relative position _p_ by doing:
     * 
     * - _p = r * (length(V) -1)_
     * 
     * Since p is not always an integer, we can't look for exactly that position inside _V_,
     * we need to get an intermediate value that:
     * 
     * - _d_ is the non integer component of _p_, therefore if _p_ is an integer, _d = 0_
     * - The final value must be between _V[p - d]_ and _V[(p - d)+1]_ (If V[p+1] exists)
     * - The final value must be closser to the nearest index value.
     * 
     * To map those values we can use the following equations:
     * 
     * - _Delta(p) = (V[(p-d)+1] - V[p-d])_
     * - _W(r) = V[p-d] + Delta(p) * sin(r*PI/2)_
     *
     *
     * */

    const relativePosition = t * (set.length - 1);
    const intComponent = Math.floor(relativePosition);
    const integerDifference = relativePosition - intComponent;

    const neighborDiff =
      set[Math.min(intComponent + 1, set.length - 1)] - set[intComponent];

    const relativeDisplacement =
      Math.sin((integerDifference * Math.PI) / 2) * neighborDiff; // sin(2xPI/2)m

    return set[intComponent] + relativeDisplacement; // y=msin(2xPI/2)+b
  }

  constructor(scale: number, amplitude: number) {
    super();
    this.scale = scale;
    this.amplitude = amplitude;
    this.xPointSet = this.createRandomSet();
    this.zPointSet = this.createRandomSet();
  }

  getPoint(t: number): Vector3 {
    const xSetValue = this.getTValueForSet(t, this.xPointSet);
    const zSetValue = this.getTValueForSet(t, this.zPointSet);

    const tx = xSetValue;
    const tz = zSetValue;
    const ty = t * this.scale;
    return new Vector3(tx, ty, tz);
  }
}

export function generateCurve(scene: Scene) {
  const path = new TestCurve(200, 20);
  const radius = 2;
  const geometry = new TubeGeometry(path, 60, radius, 20, false);

  const material = new MeshPhongMaterial({
    color: 0x22ee55,
  });

  const tube = new Mesh(geometry, material);

  scene.add(tube);
  return tube;
}
