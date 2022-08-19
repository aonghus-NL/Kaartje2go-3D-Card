import { Matrix4, Mesh, Object3D, Texture } from 'three';
import THREE = require('three');
import createPlaneGeometry from '../geometry/planeGeometry';
import isAbsolutePath from '../helpers/location/isAbsolutePath';
import createMeshPhongMaterial from '../material/meshPhongMaterial';
import { CardFormat, CardPages } from '../types/card';

const CARD_SIZES: Record<CardFormat, [number, number]> = {
    'square': [4, 4],
    'portrait': [3.5, 5],
    'landscape': [5, 3.5],
    'skyscraper': [2.5, 5.5]
};

const CARD_ROTATION: Record<CardFormat, [x: number, y: number]> = {
    'square': [0, 5.1],
    'portrait': [0, 5.1],
    'landscape': [5.1, 0],
    'skyscraper': [0, 5.1]
};

const CARD_PIVOT_OFFSET: Record<CardFormat, [number, number, number]> = {
    'square': [-CARD_SIZES.square[0] / 2, 0, 0],
    'portrait': [-CARD_SIZES.portrait[0] / 2, 0, 0],
    'landscape': [0, CARD_SIZES.landscape[1] / 2, 0],
    'skyscraper': [-CARD_SIZES.skyscraper[0] / 2, 0, 0],
};

const createPage = (cardFormat: CardFormat, frontTexture: Texture, backTexture: Texture, cardPages: CardPages, isFront?: boolean, specularTexture?: Texture) => {
    const geometry1 = createPlaneGeometry(CARD_SIZES[cardFormat][0], CARD_SIZES[cardFormat][1]);
    const geometry2 = geometry1.clone();
    const material1 = createMeshPhongMaterial(frontTexture);
    const material2 = createMeshPhongMaterial(backTexture);

    const pivotOffset = CARD_PIVOT_OFFSET[cardFormat];
    geometry2.applyMatrix4(new Matrix4().makeRotationY(Math.PI));
    geometry1.applyMatrix4(new THREE.Matrix4().makeTranslation(-pivotOffset[0], -pivotOffset[1], -pivotOffset[2]));
    geometry2.applyMatrix4(new THREE.Matrix4().makeTranslation(-pivotOffset[0], -pivotOffset[1], -pivotOffset[2]));
   
    const page = new Object3D();
    const rotation = CARD_ROTATION[cardFormat];

    page.name = isFront ? "front" : "back";

    if (isFront) {
        if (specularTexture) {
            material1.specularMap = specularTexture;
            material1.specular = new THREE.Color(0x777777);
            material1.shininess = 100;
            material1.reflectivity = 0;
        }

        if (cardFormat === 'landscape') {
            backTexture.rotation = THREE.MathUtils.degToRad(180);
            backTexture.center = new THREE.Vector2(0.5, 0.5);
        }
        page.rotation.set(rotation[0], rotation[1], 0);
    }
    else {
        if (specularTexture) {
            material2.specularMap = specularTexture;
            material2.specular = new THREE.Color(0x777777);
            material2.shininess = 200;
            material2.reflectivity = 0;
        }

        if (cardFormat === 'portrait' && cardPages === 'single' && !isAbsolutePath(backTexture.name)) {
            backTexture.rotation = THREE.MathUtils.degToRad(90);
            backTexture.center = new THREE.Vector2(0.5, 0.5);
        }
    }

    page.position.set(pivotOffset[0], pivotOffset[1], pivotOffset[2]);
    page.add(new Mesh(geometry1, material1));
    page.add(new Mesh(geometry2, material2));
    return page;
};

export default createPage;