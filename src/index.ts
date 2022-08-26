// Vendors
import { Color, Object3D, PerspectiveCamera, Scene } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import THREE = require('three');
import { GUI } from 'dat.gui';
import TWEEN = require('@tweenjs/tween.js')

// Helpers
import addAmbientLight from './light/ambientLight';
import addDirectionalLight from './light/directionalLight';
import loadTextures from './loaders/textures';
import createPage from './parts/createPage';
import createPerspectiveCamera from './camera/perspective';
import createWebGLRenderer from './renderer/webGL';
import addHemisphereLight from './light/hemisphereLight';

// Typings
import { CardFormat, CardPages, CardImages } from './types/card';

window.__DEBUG__ = false;

const cardOpen = {
    min: 190,
    max: 355
}

function getTextures(cardImages: CardImages) {
    const images = [cardImages.front, cardImages.back];

    if (cardImages.insideLeft) {
        images.push(cardImages.insideLeft);
    }
    
    if (cardImages.insideRight) {
        images.push(cardImages.insideRight);
    }
    
    if (cardImages.foilSpecularFront) {
        images.push(cardImages.foilSpecularFront);
    }

    if (cardImages.foilSpecularBack) {
        images.push(cardImages.foilSpecularBack);
    }

    const textures =  loadTextures(images);
    textures.forEach(texture => {
        texture.minFilter = THREE.NearestFilter;
        texture.anisotropy = 16;
    });

    return textures;
}

function addLight(scene: Scene, cardFormat: CardFormat) {
    addHemisphereLight(scene);
    addAmbientLight(scene, 0xffffff, 0.7);
    const intensity = 0.1;
    addDirectionalLight(scene, 0xffffff, intensity, {
        x: 0,
        y: 5,
        z: 10
    });
    addDirectionalLight(scene, 0x555555, 0.05, {
        x: 0,
        y: 0,
        z: 10
    }, false);
    addDirectionalLight(scene, 0xffffff, 0.1, {
        x: 0,
        y: 10,
        z: 0
    }, false);

    if (cardFormat === "landscape") {
        addDirectionalLight(scene, 0x555555, 0.1, {
            x: 0,
            y: -6,
            z: -10
        }, false);
    }
    else {
        addDirectionalLight(scene, 0x555555, 0.1, {
            x: 0,
            y: 0,
            z: -10
        }, false);
        addDirectionalLight(scene, 0xffffff, 0.1, {
            x: -6,
            y: 1,
            z: 0
        }, false);
        addDirectionalLight(scene, 0xffffff, 0.1, {
            x: 5,
            y: 5.5,
            z: -1
        }, false);
    }
}

function addCard(scene: Scene, cardFormat: CardFormat, cardPages: CardPages, cardImages: CardImages) {
    const [
        frontTexture,
        backTexture,
        insideLeftTexture,
        insideRightTexture,
        foilSpecularFrontTexture,
        foilSpecularBackTexture
    ] = getTextures(cardImages);
    
    const card = new Object3D();
    if (cardPages === 'single') {
        card.add(createPage(cardFormat, frontTexture, backTexture, cardPages, false, foilSpecularBackTexture));
    } else {
        card.add(createPage(cardFormat, frontTexture, insideLeftTexture, cardPages, true, foilSpecularFrontTexture));
        card.add(createPage(cardFormat, insideRightTexture, backTexture, cardPages, false, foilSpecularBackTexture));
    }

    if (cardFormat === 'landscape') {
        card.rotateX(-0.3);
    } else {
        card.rotateY(-0.3);
    }

    card.traverse(object => { 
        if (object.isObject3D) {
            object.castShadow = true; 
            object.receiveShadow = false;
        }
    });

    scene.add(card);

    return card;
}

function addPlane(scene: Scene) {
    const planeGeometry = new THREE.PlaneGeometry(30, 30, 32, 32);
    const color = new Color("rgb(200, 200, 200)") 
    const planeMaterial = new THREE.MeshStandardMaterial( { color: color } )
    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.position.y = -3;
    plane.rotation.x = Math.PI / -2;
    plane.receiveShadow = true;
    scene.add( plane );
}

function addGUI(card: Object3D, cardFormat: CardFormat, domElement: Element) {
    const front = card.getObjectByName("front");

    if (!front) {
        return;
    }

    const gui = new GUI({ autoPlace: false })
    gui.width = 150;
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "0";
    gui.domElement.style.right = "0";
    domElement.appendChild(gui.domElement);

    let open = {
        degrees: 360 - THREE.MathUtils.radToDeg(front.rotation[getRotateAxis(cardFormat)]) / 360 * 100
    };

    const cubeFolder = gui.addFolder('Card')
    cubeFolder.add(open, 'degrees', cardOpen.min, cardOpen.max)
        .name("degrees")
        .onChange(() => {
            front.rotation[getRotateAxis(cardFormat)] = THREE.MathUtils.degToRad(open.degrees);
        });
    // cubeFolder.add(front.rotation, cardFormat === "landscape" ? 'x' : 'y', Math.PI * 1.1, Math.PI * 1.99).name("open (%)");
    cubeFolder.open();
    gui.open();

}

function addControls(camera: PerspectiveCamera, domElement: HTMLCanvasElement) {
    const control = new OrbitControls(camera, domElement);
    control.autoRotate = true;

    control.addEventListener('start', function(){
        control.autoRotate = false;
    });

    return control;
}

function getRotateAxis(cardFormat: CardFormat) {
    return cardFormat === "landscape" ? 'x' : 'y';
}

export function generateCardPreview(cardFormat: CardFormat, cardPages: CardPages, cardImages: CardImages, domElement: Element) {
    console.info('Running for', cardFormat, cardPages, cardImages, domElement);

    const scene = new Scene();
    const renderer = createWebGLRenderer(domElement);
    const camera = createPerspectiveCamera(scene, domElement);
    const control = addControls(camera, renderer.domElement);
    
    __DEBUG__ && scene.add(new THREE.AxesHelper(500));
    scene.background = new Color("rgb(230, 230, 230)"); 
    
    const card = addCard(scene, cardFormat, cardPages, cardImages);
    addLight(scene, cardFormat);
    addPlane(scene);
    
    // GUI
    addGUI(card, cardFormat, domElement);
    
    // Animator
    function render() {
        requestAnimationFrame(render);
        resizeCanvasToDisplaySize();
        control.update();
        TWEEN.update()
        renderer.render(scene, camera);
    }
    
    // Resize
    function resizeCanvasToDisplaySize() {
        camera.aspect = domElement.clientWidth / domElement.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(domElement.clientWidth, domElement.clientHeight);
    }
    
    function foldCard() {
        const front = card.getObjectByName("front");

        if (!front) {
            return;
        }

        let rotateAxis: 'x' | 'y' = getRotateAxis(cardFormat);

        const move = THREE.MathUtils.radToDeg(front.rotation[rotateAxis]) > 290 ? THREE.MathUtils.degToRad(cardOpen.min) : THREE.MathUtils.degToRad(cardOpen.max);
        new TWEEN.Tween(front.rotation).to({ [rotateAxis]: move }, 700).easing(TWEEN.Easing.Quadratic.Out).stopChainedTweens().start();
    }

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    function handleClick(event: MouseEvent) {
        event.preventDefault();

        mouse.x = (event.offsetX / domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.offsetY / domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        let intersects = raycaster.intersectObjects(card.children);

        if (intersects.length) {
            foldCard();
        }
    }

    domElement.parentElement?.addEventListener('mousedown', handleClick);

    render();
}

// Testing
// import squareFrontImg from './assets/square-double-front.jpg';
// import squareInsideRightImg from './assets/square-double-inside-right.jpg';
// import squareInsideLeftImg from './assets/square-double-inside-left.jpg';
// import squareBackImg from './assets/square-double-back.jpg';

// import rectpFrontImg from './assets/rectp-double-front.jpg';
// import rectpInsideRightImg from './assets/rectp-double-inside-right.jpg';
// import rectpInsideLeftImg from './assets/rectp-double-inside-left.jpg';
// import rectpBackImg from './assets/rectp-double-back.jpg';
// import rectpSpecularFrontImg from './assets/rectp-double-specular.jpg';
// import rectpSpecularBackImg from './assets/rectp-double-back-specular.jpg';

// const images: Record<CardFormat, CardImages> = {
//     'square': {
//         front: squareFrontImg,
//         insideLeft: squareInsideLeftImg,
//         insideRight: squareInsideRightImg,
//         back: squareBackImg
//     },
//     'portrait': {
//         front: rectpFrontImg,
//         insideLeft: rectpInsideLeftImg,
//         insideRight: rectpInsideRightImg,
//         back: rectpBackImg,
//         foilSpecularFront: rectpSpecularFrontImg,
//         foilSpecularBack: rectpSpecularBackImg
//     },
//     'landscape': {
//         front: rectpFrontImg,
//         insideLeft: rectpInsideLeftImg,
//         insideRight: rectpInsideRightImg,
//         back: rectpBackImg,
//     },
//     'skyscraper': {
//         front: rectpFrontImg,
//         insideLeft: rectpInsideLeftImg,
//         insideRight: rectpInsideRightImg,
//         back: rectpBackImg
//     }
// };

// const DOM_ELEMENT = document.querySelector('.card');

// if (DOM_ELEMENT) {
//     generateCardPreview('landscape', 'double', images['square'], DOM_ELEMENT);
// }