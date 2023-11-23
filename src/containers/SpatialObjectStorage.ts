import { immerable, produce } from 'immer';

export class SpatialObjectStorage<ObjectType = unknown> {
  [immerable] = true;

  private _objectStorage = new Map<string, ObjectType>();

  constructor(private readonly _nDimensions: number) {}

  get nDimensions() {
    return this._nDimensions;
  }

  setObject({ position, object }: { position: number[]; object: ObjectType }): this {
    const key = this.serializeKey(...position);
    return produce(this, (draft: this) => {
      draft._objectStorage.set(key, object);
    });
  }

  getObject({ position }: { position: number[] }) {
    const key = this.serializeKey(...position);
    return { position, ...this._objectStorage.get(key) };
  }

  entries() {
    const mapEntries = this._objectStorage.entries();
    return Array.from(mapEntries, ([key, object]) => {
      const position = this.deserializeKey(key);
      return { position, ...object };
    });
  }

  protected serializeKey(...coordinates: number[]) {
    if (coordinates.length !== this.nDimensions) {
      throw new Error(`Expected ${this.nDimensions} coordinates, but got ${coordinates.length}`);
    }
    return coordinates.join('_');
  }

  protected deserializeKey(key: string) {
    const values = key.split('_').map((coordinate) => Number(coordinate));
    if (values.length !== this.nDimensions) {
      throw new Error(`Expected ${this.nDimensions} coordinates, but got ${values.length}`);
    }
    return values;
  }
}
