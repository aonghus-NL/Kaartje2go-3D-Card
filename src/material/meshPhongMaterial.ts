import { MeshPhongMaterial, Texture } from 'three';

const createMeshPhongMaterial = (texture: Texture) => {
    return new MeshPhongMaterial({
        map: texture,
        color: 0xffffff,
        specular: 0x050505,
        shininess: 100,
    });
};

export default createMeshPhongMaterial;