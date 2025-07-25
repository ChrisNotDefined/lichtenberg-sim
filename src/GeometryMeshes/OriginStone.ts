import { IcosahedronGeometry, Mesh } from "three";
import { OriginStoneMaterial } from "../ObjectMaterials/OriginStoneMaterial";

export const buildOriginStone = (radius: number) => {
  const sphereGeometry = new IcosahedronGeometry(radius);

  sphereGeometry.rotateZ(Math.PI / 6);

  return new Mesh(sphereGeometry, OriginStoneMaterial);
}
