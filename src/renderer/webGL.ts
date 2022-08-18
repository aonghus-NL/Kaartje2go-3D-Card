import { WebGLRenderer } from 'three';

const createWebGLRenderer = (canvas: Element | null) => {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.shadowMap.enabled = true

    canvas?.appendChild(renderer.domElement);

    return renderer;
};

export default createWebGLRenderer;