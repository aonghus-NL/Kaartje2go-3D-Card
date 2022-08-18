import { DirectionalLight, DirectionalLightHelper } from 'three';
import type { Scene } from 'three';

interface LightDirection {
    x: number;
    y: number;
    z: number;
}

const addDirectionalLight = (scene: Scene, color: number, intensity: number, direction: LightDirection = { x: -1, y: 1.75, z: 1 }, castShadow = true) => {
    const dirLight = new DirectionalLight( color, intensity );
    dirLight.position.set(direction.x, direction.y, direction.z);
    scene.add( dirLight );
    
    if (castShadow) {
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.bias = 0.0001;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 150;
        dirLight.shadow.radius = 3;
    }

    if (__DEBUG__) {
        const dirLightHelper = new DirectionalLightHelper(dirLight, 10, 0xff0000);
        scene.add( dirLightHelper );
    }

    return dirLight;
};

export default addDirectionalLight;