import { Matrix4, Mesh, Object3D, Scene, Texture } from 'three';
import createPlaneGeometry from '../geometry/planeGeometry';
import createMeshPhongMaterial from '../material/meshPhongMaterial';
import { CardFormat } from '../types/card';

const CARD_SIZES: Record<CardFormat, [number, number]> = {
    'square': [4, 4],
    'portrait': [3.5, 5],
    'landscape': [5, 3.5],
    'skyscraper': [2.5, 5.5]
};

const CARD_POSITION: Record<CardFormat, [[x: number, y: number, z: number], [x: number, y: number]]> = {
    'square': [[-0.92, 0, 1.683], [0, -1.0]],
    'portrait': [[-0.8, 0, 1.47], [0, -1.0]],
    'landscape': [[0, 0.78, 1.48], [-1.0, 0]],
    'skyscraper': [[-0.92, 0, 1.683], [0, -1.0]]
};

const createPage = (cardFormat: CardFormat, frontTexture: Texture, backTexture: Texture, isFront = false) => {
    const geometry1 = createPlaneGeometry(CARD_SIZES[cardFormat][0], CARD_SIZES[cardFormat][1]);
    const geometry2 = geometry1.clone();
    const material1 = createMeshPhongMaterial(frontTexture);
    const material2 = createMeshPhongMaterial(backTexture);

    geometry2.applyMatrix4(new Matrix4().makeRotationY( Math.PI ));

    const page = new Object3D();
    const [position, rotation] = CARD_POSITION[cardFormat];

    if (isFront) {
        page.position.set(position[0], position[1], position[2]);
        page.rotation.set(rotation[0], rotation[1], 0);
    }
    
    page.add(new Mesh(geometry1, material1));
    page.add(new Mesh(geometry2, material2));
    
    return page;
};

export default createPage;