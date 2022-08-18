import { AmbientLight } from 'three';
import type { Scene } from 'three';

const addAmbientLight = (scene: Scene, color: number, intensity?: number) => {
    const ambientLight = new AmbientLight(color, intensity);
    scene.add(ambientLight);
    return ambientLight;
};

export default addAmbientLight;

