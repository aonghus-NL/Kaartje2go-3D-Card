import { DirectionalLight, DirectionalLightHelper } from 'three';
import type { Scene } from 'three';

interface LightDirection {
    x: number;
    y: number;
    z: number;
}

const addDirectionalLight = (scene: Scene, color: number, intensity: number, direction: LightDirection = { x: -1, y: 1.75, z: 1 }) => {
    const dirLight = new DirectionalLight( color, intensity );
    dirLight.position.set(direction.x, direction.y, direction.z);
    scene.add( dirLight );

    dirLight.castShadow = true;

    const dirLightHelper = new DirectionalLightHelper(dirLight, 10, 0xff0000);
    scene.add( dirLightHelper );

    return dirLight;
};

export default addDirectionalLight;