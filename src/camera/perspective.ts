import { PerspectiveCamera, CameraHelper, Scene } from 'three';

const createPerspectiveCamera = (scene: Scene) => {
    const camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set( 0, 0, 15 );

    const cameraHelper = new CameraHelper(camera);
    scene.add(cameraHelper);

    return camera;
};

export default createPerspectiveCamera;