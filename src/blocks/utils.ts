import type { PositionTuple } from '@/types';

export function getPlaceBlockPosition({
  position,
  face,
}: {
  position: PositionTuple;
  face: number;
}): PositionTuple {
  const [x, y, z] = position;
  switch (face) {
    // Positive X
    case 0:
    case 1:
      return [x + 1, y, z];

    // Negative X
    case 2:
    case 3:
      return [x - 1, y, z];

    // Positive Y
    case 4:
    case 5:
      // Place on top
      return [x, y + 1, z];

    // Negative Y
    case 6:
    case 7:
      // Place on bottom
      return [x, y - 1, z];

    // Positive Z
    case 8:
    case 9:
      return [x, y, z + 1];

    // Negative Z
    case 10:
    case 11:
      return [x, y, z - 1];

    default:
      throw new Error('no face');
  }
}
