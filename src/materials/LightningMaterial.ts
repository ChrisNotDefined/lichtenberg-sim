import { MeshStandardMaterial } from "three";

const LIGHTNING_MATERIAL_COLOR = 0x8899FF;

export const LightningMaterial = new MeshStandardMaterial({
  color: LIGHTNING_MATERIAL_COLOR,
  opacity: 0.8,
  transparent: true,
  emissive: LIGHTNING_MATERIAL_COLOR,
});
