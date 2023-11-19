import { TextureLoader, NearestFilter } from 'three';

import {
  dirtImage,
  glassImage,
  grassImage,
  logImage,
  woodImage,
  sandImage,
  stoneImage,
} from './images';

const loader = new TextureLoader();

const dirtTexture = loader.load(dirtImage);
dirtTexture.magFilter = NearestFilter;

const glassTexture = loader.load(glassImage);
glassTexture.magFilter = NearestFilter;

const grassTexture = loader.load(grassImage);
grassTexture.magFilter = NearestFilter;

const logTexture = loader.load(logImage);
logTexture.magFilter = NearestFilter;

const woodTexture = loader.load(woodImage);
woodTexture.magFilter = NearestFilter;

const sandTexture = loader.load(sandImage);
sandTexture.magFilter = NearestFilter;

const stoneTexture = loader.load(stoneImage);
stoneTexture.magFilter = NearestFilter;

export {
  dirtTexture,
  glassTexture,
  grassTexture,
  logTexture,
  woodTexture,
  sandTexture,
  stoneTexture,
};
