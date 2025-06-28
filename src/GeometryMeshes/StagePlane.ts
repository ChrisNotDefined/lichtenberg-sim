import { CircleGeometry, Mesh } from "three";
import { StagePlaneMaterial } from "../ObjectMaterials/StagePlane";

export const buildStagePlane = () => {
  const planeGeometry = new CircleGeometry(400, 400);
  planeGeometry.rotateX(-Math.PI / 2);

  return new Mesh(planeGeometry, StagePlaneMaterial);
}