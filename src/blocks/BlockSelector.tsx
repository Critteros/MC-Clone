import { useEffect, useState } from 'react';

import { useBlockSelection } from './stores/useBlockSelection';
import styles from './BlockSelector.module.css';

import { dirtImage, grassImage, stoneImage, woodImage, logImage } from './textures/paths';
import { BlockType } from './types';

const placableBlocks = [
  { img: dirtImage, type: BlockType.Dirt },
  { img: grassImage, type: BlockType.Grass },
  { img: stoneImage, type: BlockType.Stone },
  { img: woodImage, type: BlockType.Wood },
  { img: logImage, type: BlockType.Log },
];

export function BlockSelector() {
  const [selected, setSelected] = useState(0);
  const { setSelectedBlock } = useBlockSelection();

  useEffect(() => {
    setSelectedBlock(placableBlocks[selected].type);
  }, [selected, setSelectedBlock]);

  useEffect(() => {
    const listener = (e: WheelEvent) => {
      const change = e.deltaY >= 0 ? 1 : -1;
      const nextIndex =
        selected + change > 0
          ? (selected + change) % placableBlocks.length
          : placableBlocks.length - 1;

      setSelected(nextIndex);
    };
    document.addEventListener('wheel', listener);

    return () => {
      document.removeEventListener('wheel', listener);
    };
  });

  return (
    <div className={styles.wrapper}>
      {placableBlocks.map(({ img, type }, index) => (
        <div key={type}>
          <img className={`${styles.img} ${selected === index ? styles.selected : ''}`} src={img} />
        </div>
      ))}
    </div>
  );
}
