import { createMachine, assign } from 'xstate';
import * as api from "./api";
import {IFindingFalconeContext, FindingFalconeEvents} from "./types";

const initialContextDefault: IFindingFalconeContext = {
  planets: [],
  vehicles: [],
  result: null,
  selectedValues: [{ vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}]
};

export const createFindFalconeMachine = (api, initialContext = initialContextDefault) => {
  return createMachine<IFindingFalconeContext, FindingFalconeEvents>({
    id: 'findFalcone',
    context: {
      ...initialContext,
    },
    initial: 'loading',
    states: {
      idle: {
        on: {
          SUBMIT: [
            {
              target: '#findFalcone.loading.findingFalcone',
            },
            {
              target: 'error'
            }
          ],
          UPDATE_SELECTED_VEHICLE: {
            actions: ['updateSelectedVehicle']
          },
          UPDATE_SELECTED_PLANET: {
            actions: ['updateSelectedPlanet']
          }
        },
        states: {
          normal: {},
          error: {}
        },
      },
      loading: {
        initial: 'fetchingPlanetsAndVehicles',
        states: {
          // Fetching token only needed to find falcone
          fetchingPlanetsAndVehicles: {
            invoke: {
              src: api.fetchPlanetsAndVehicles,
              onDone: {
                target: '#findFalcone.idle',
                actions: ['updateVehiclesAndPlanets']
              },
              onError: {
                target: '#findFalcone.error'
              }
            }
          },
          findingFalcone: {
            invoke: {
              src: api.findfalcone,
              onDone: {
                target: '#findFalcone.finish',
                actions: ['updateResult']
              },
              onError: {
                target: '#findFalcone.error'
              }
            }
          }
        }
      },
      finish: {
        on: {
          RESET: {
            target: '#findFalcone.idle.normal',
            actions: ['resetContext']
          }
        }
      },
      error: {

      }
    },
  }, {
    actions: {
      updateVehiclesAndPlanets: assign<IFindingFalconeContext, FindingFalconeEvents>((_ctx, event) => {
        // @ts-ignore
        return event?.data
      }),
      updateSelectedVehicle: assign<IFindingFalconeContext, FindingFalconeEvents>((context, event) => {
        if (event.type !== 'UPDATE_SELECTED_VEHICLE') {
          return {}
        }

        const { selectedValues } = context;
        // @ts-ignore
        selectedValues[event?.index].vehicle = event?.value;

        return {
          selectedValues
        }
      }),
      updateSelectedPlanet: assign<IFindingFalconeContext, FindingFalconeEvents>((context, event) => {
        if (event.type !== 'UPDATE_SELECTED_PLANET') {
          return {}
        }

        const { selectedValues } = context;
        // @ts-ignore
        selectedValues[event?.index].planet = event?.value;

        return {
          selectedValues
        }
      }),
      updateResult: assign<IFindingFalconeContext, FindingFalconeEvents>((_context, event) => {
        return {
          // @ts-ignore
          result: event?.data
        }
      }),
      resetContext: assign<IFindingFalconeContext, FindingFalconeEvents>(() => initialContextDefault)
    }
  });
};

export const findFalconeMachine = createFindFalconeMachine(api);

export default findFalconeMachine;
