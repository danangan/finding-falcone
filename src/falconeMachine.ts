import {createMachine, assign} from 'xstate';
import defaultApi, { IApi } from "./api";
import {
  IFindingFalconeContext,
  FindingFalconeEvents,
  DoneFetchPlanetsAndVehicleEvent,
  UpdateSelectedVehicleEvent, UpdateSelectedPlanetEvent, DoneFindFalconeEvent
} from "./types";

const initialContextDefault: IFindingFalconeContext = {
  planets: [],
  vehicles: [],
  result: null,
  selectedValues: [{ vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}]
};

function createContextCopy (context: IFindingFalconeContext): IFindingFalconeContext {
  const {selectedValues, planets, vehicles, result} = context;
  return {
    planets: [...planets],
    vehicles: [...vehicles],
    result: result ? {...result} : result,
    selectedValues: [{ ...selectedValues[0] }, { ...selectedValues[1] }, { ...selectedValues[2] }, { ...selectedValues[3] }],
  }
};

export const createFindFalconeMachine = (api: IApi = defaultApi, initialContext: IFindingFalconeContext = initialContextDefault) => {
  return createMachine<IFindingFalconeContext, FindingFalconeEvents>({
    id: 'findFalcone',
    context: createContextCopy(initialContext),
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
              src: api.findFalcone,
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
      updateVehiclesAndPlanets: assign<IFindingFalconeContext, DoneFetchPlanetsAndVehicleEvent>((_ctx, event) => {
        return event.data
      }),
      updateSelectedVehicle: assign<IFindingFalconeContext, UpdateSelectedVehicleEvent>((context, event) => {
        const { selectedValues } = context;
        selectedValues[event?.index].vehicle = event?.value;

        return {
          selectedValues
        }
      }),
      updateSelectedPlanet: assign<IFindingFalconeContext, UpdateSelectedPlanetEvent>((context, event) => {
        const { selectedValues } = context;

        selectedValues[event?.index].planet = event?.value;

        return {
          selectedValues
        }
      }),
      updateResult: assign<IFindingFalconeContext, DoneFindFalconeEvent>((_context, event) => {
        return {
          result: event.data
        }
      }),
      resetContext: assign<IFindingFalconeContext, FindingFalconeEvents>(() => createContextCopy(initialContextDefault))
    }
  });
};

export const findFalconeMachine = createFindFalconeMachine();

export default findFalconeMachine;
