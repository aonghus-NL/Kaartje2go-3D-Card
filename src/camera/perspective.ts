import { PerspectiveCamera, CameraHelper, Scene } from 'three';

const createPerspectiveCamera = (scene: Scene, domElement: Element) => {
    const camera = new PerspectiveCamera(50, domElement.clientWidth / domElement.clientHeight, 1, 5000);
    camera.position.set( 0, 0, 15 );

    // const cameraHelper = new CameraHelper(camera);
    // scene.add(cameraHelper);

    return camera;
};

export default createPerspectiveCamera;