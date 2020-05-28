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

export interface SubmitEvent {
  type: 'SUBMIT'
}

export interface UpdateSelectedVehicleEvent {
  type: 'UPDATE_SELECTED_VEHICLE';
  index: 0 | 1 | 2 | 3;
  value: string;
}

export interface UpdateSelectedPlanetEvent {
  type: 'UPDATE_SELECTED_PLANET';
  index: 0 | 1 | 2 | 3;
  value: string;
}

export type DoneFetchPlanetsAndVehicleEvent = DoneInvokeEvent<{planets: Array<IPlanet>, vehicles: Array<IVehicles>}>

export type DoneFindFalconeEvent = DoneInvokeEvent<{status: STATUS, planet?: String}>

export type FindingFalconeEvents =
  | SubmitEvent
  | UpdateSelectedVehicleEvent
  | UpdateSelectedPlanetEvent
  | DoneFetchPlanetsAndVehicleEvent
  | DoneFindFalconeEvent
