/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents */
export interface IScript {
  run(...params: any[]): any | Promise<any>;
}
/* eslint-enable */
