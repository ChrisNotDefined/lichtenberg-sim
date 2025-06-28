import { MeshPhongMaterial } from "three";
import { stoneTexture } from "../Textures/stone";

export const OriginStoneMaterial = new MeshPhongMaterial({
  color: 0x441812,
  map: stoneTexture
})
