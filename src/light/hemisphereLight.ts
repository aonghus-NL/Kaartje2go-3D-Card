import { HemisphereLight } from 'three';
import type { Scene } from 'three';

const addHemisphereLight = (scene: Scene) => {
    const hemisphereLight = new HemisphereLight(0xffffff, 0xffffff);
    hemisphereLight.intensity = 0.1;
    scene.add(hemisphereLight);
    return hemisphereLight;
};

export default addHemisphereLight;

