import { MeshPhongMaterial } from "three";
import { stoneTexture } from "../Textures/stone";

export const StagePlaneMaterial = new MeshPhongMaterial({
  color: 0x222222,
  map: stoneTexture,
});
