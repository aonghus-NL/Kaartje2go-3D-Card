// Vendors
import { CameraHelper, Color, Object3D, PerspectiveCamera, Scene } from 'three';
import { ObjectControls } from 'threejs-object-controls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

// Helpers
import addAmbientLight from './light/ambientLight';
import addDirectionalLight from './light/directionalLight';
import loadTextures from './loaders/textures';
import createPage from './parts/createPage';
import createPerspectiveCamera from './camera/perspective';
import createWebGLRenderer from './renderer/webGL';

// Typings
import { CardFormat, CardPages, CardImages } from './types/card';

// Assets
import squareFrontImg from './assets/square-double-front.jpg';
import squareInsideRightImg from './assets/square-double-inside-right.jpg';
import squareInsideLeftImg from './assets/square-double-inside-left.jpg';
import squareBackImg from './assets/square-double-back.jpg';

import rectpFrontImg from './assets/rectp-double-front.jpg';
import rectpInsideRightImg from './assets/rectp-double-inside-right.jpg';
import rectpInsideLeftImg from './assets/rectp-double-inside-left.jpg';
import rectpBackImg from './assets/rectp-double-back.jpg';

import addHemisphereLight from './light/hemisphereLight';

const DOM_ELEMENT = document.querySelector('.card');

const images: Record<CardFormat, CardImages> = {
    'square': {
        front: squareFrontImg,
        insideLeft: squareInsideLeftImg,
        insideRight: squareInsideRightImg,
        back: squareBackImg
    },
    'portrait': {
        front: rectpFrontImg,
        insideLeft: rectpInsideLeftImg,
        insideRight: rectpInsideRightImg,
        back: rectpBackImg
    },
    'landscape': {
        front: rectpFrontImg,
        insideLeft: rectpInsideLeftImg,
        insideRight: rectpInsideRightImg,
        back: rectpBackImg
    },
    'skyscraper': {
        front: rectpFrontImg,
        insideLeft: rectpInsideLeftImg,
        insideRight: rectpInsideRightImg,
        back: rectpBackImg
    }
};

function getTextures(cardImages: CardImages) {
    const images = [cardImages.front, cardImages.back];

    if (cardImages.insideLeft) {
        images.push(cardImages.insideLeft);
    }

    if (cardImages.insideRight) {
        images.push(cardImages.insideRight);
    }

    return loadTextures(images);
}

function addLight(scene: Scene) {
    addHemisphereLight(scene);
    addAmbientLight(scene, 0xffffff, 0.4);
    addDirectionalLight(scene, 0xffffff, 0.4, {
        x: 2.5,
        y: 2.5,
        z: 2.5
    });
    addDirectionalLight(scene, 0xffffff, 0.4, {
        x: -2.5,
        y: 2.5,
        z: 2.5
    });
}

function addCard(scene: Scene, cardFormat: CardFormat, cardPages: CardPages, cardImages: CardImages) {
    const [frontTexture, backTexture, insideLeftTexture, insideRightTexture] = getTextures(cardImages);

    const card = new Object3D();
    if (cardPages === 'single') {
        card.add(createPage(cardFormat, frontTexture, backTexture));
    } else {
        card.add(createPage(cardFormat, frontTexture, insideLeftTexture, true));
        card.add(createPage(cardFormat, insideRightTexture, backTexture));
    }

    if (cardFormat === 'landscape') {
        card.rotateX(-0.3);
    } else {
        card.rotateY(0.3);
    }

    card.castShadow = true;
    scene.add(card);

    return card;
}

function addControls(camera: PerspectiveCamera, cardFormat: CardFormat, domElement: HTMLCanvasElement, card: Object3D) {
    const controls = new ObjectControls(camera, domElement, card);
    if (cardFormat === 'landscape') {
        controls.enableVerticalRotation();
        controls.disableHorizontalRotation();
    } else {
        controls.disableVerticalRotation();
        controls.enableHorizontalRotation();
    }
    controls.setRotationSpeed(0.15);
    controls.setDistance(2, 15);
    controls.setZoomSpeed(1);
    // controls.enableVerticalRotation();
}

function startApplication(cardFormat: CardFormat, cardPages: CardPages, cardImages: CardImages, domElement: Element) {
    console.info('Running for', cardFormat, cardPages, cardImages, domElement);

    const scene = new Scene();
    scene.background = new Color(0x000000);

    const renderer = createWebGLRenderer(DOM_ELEMENT);
    const camera = createPerspectiveCamera(scene);

    addLight(scene);
    const card = addCard(scene, cardFormat, cardPages, cardImages);
    addControls(camera, cardFormat, renderer.domElement, card);

    // Stats
    // const stats = Stats();
    // document.body.appendChild(stats.dom);

    // GUI
    // const gui = new GUI()

    // const cubeFolder = gui.addFolder('Card')
    // cubeFolder.add(card.rotation, 'x', 0, Math.PI * 2);
    // cubeFolder.add(card.rotation, 'y', 0, Math.PI * 2);
    // cubeFolder.add(card.rotation, 'z', 0, Math.PI * 2);
    // cubeFolder.open();

    // const cameraFolder = gui.addFolder('Camera');
    // cameraFolder.add(camera.position, 'z', 0, 100);
    // cameraFolder.open();

    // const lightFolder = gui.addFolder('Ambient Light');
    // lightFolder.add(ambientLight, 'intensity', 0, 1);
    // lightFolder.open();

    // const dirLight1Folder = gui.addFolder('Directional Light 1');
    // dirLight1Folder.add(dirLight1.position, 'x', -10, 10);
    // dirLight1Folder.add(dirLight1.position, 'y', -10, 10);
    // dirLight1Folder.add(dirLight1.position, 'z', -10, 10);
    // dirLight1Folder.open();

    // const dirLight2Folder = gui.addFolder('Directional Light 2');
    // dirLight2Folder.add(dirLight2.position, 'x', -10, 10);
    // dirLight2Folder.add(dirLight2.position, 'y', -10, 10);
    // dirLight2Folder.add(dirLight2.position, 'z', -10, 10);
    // dirLight2Folder.open();

    // const hemisphereFolder = gui.addFolder('Hemispere Light');
    // hemisphereFolder.add(hemisphereLight, 'intensity', 0, 1);

    // Animator
    function render() {
        requestAnimationFrame(render);

        renderer.render(scene, camera);
        // stats.update();
    }

    // Resize
    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    render();
}

if (DOM_ELEMENT) {
    startApplication('landscape', 'double', images['square'], DOM_ELEMENT);
}