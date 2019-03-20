export class KeyValueStore {
  public async get(key: string | string[]) {
    if (Array.isArray(key)) {
      return key.map((k) => this.getOne(k));
    }
    return this.getOne(key);
  }

  public async put(_key: string, _value: any) {
    // TODO
  }

  protected async getOne(_key: string) {
    // TODO
    return null;
  }
}
