import { TextureLoader } from 'three';

const loadTextures = (images: string[]) => {
    const loader = new TextureLoader();
    return images.map(image => loader.load(image));
};

export default loadTextures;