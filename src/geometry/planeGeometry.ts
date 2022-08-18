import { PlaneGeometry } from 'three';

const createPlaneGeometry = (width: number, height: number) => {
    return new PlaneGeometry(width, height);
};

export default createPlaneGeometry;