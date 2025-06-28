import { MirroredRepeatWrapping, TextureLoader } from "three";
import imageUrl from "../Textures/stone.png";

const texture = new TextureLoader().load(imageUrl);
texture.wrapS = texture.wrapT = MirroredRepeatWrapping; // Repeat the texture
texture.repeat.setScalar(3);
export const stoneTexture = texture;
