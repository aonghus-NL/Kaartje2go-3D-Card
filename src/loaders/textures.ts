import { TextureLoader } from 'three';

const loadTextures = (images: string[]) => {
    const loader = new TextureLoader();

    return images.map(image => {
        const texture = loader.load(image)
        texture.name = image;
        return texture;
    });
};

export default loadTextures;