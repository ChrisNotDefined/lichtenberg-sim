import { MeshBasicMaterial } from "three";

const LIGHTNING_MATERIAL_COLOR = 0xA8E2ff;

export const LightningMaterial = new MeshBasicMaterial({
  color: LIGHTNING_MATERIAL_COLOR,
  opacity: 0.8,
  transparent: true,
});
