import { DoneInvokeEvent } from 'xstate';

export interface IPlanet {
  name: string;
  distance: number;
}

export interface IVehicles {
  name: string;
  total_no: number;
  max_distance: number;
  speed: number;
}

export interface ISelectedValues {
  vehicle: string;
  planet: string;
}

export enum STATUS {
  SUCCESS = 'success',
  FAIL = 'false',
}

export interface IFindingFalconeContext {
  planets: Array<IPlanet>;
  vehicles: Array<IVehicles>;
  result: null | {
    planetName?: string,
    status: STATUS,
  };
  selectedValues: [ISelectedValues, ISelectedValues, ISelectedValues, ISelectedValues]
}

export type FindingFalconeEvents =
  | { type: 'SUBMIT' }
  | { type: 'UPDATE_SELECTED_VEHICLE'; index: 0 | 1 | 2 | 3; value: string; }
  | { type: 'UPDATE_SELECTED_PLANET'; index: 0 | 1 | 2 | 3; value: string; }
  | DoneInvokeEvent<{planets: Array<IPlanet>, vehicles: Array<IVehicles>}>;
