import { createMachine, assign } from 'xstate';
import {fetchPlanetsAndVehicles, fetchToken, findfalcone} from "./api";
import { isFormValid } from "./selector";
import {IFindingFalconeContext, FindingFalconeEvents, IVehicles, IPlanet} from "./types";


const findFalconeMachine = createMachine<IFindingFalconeContext, FindingFalconeEvents>({
  id: 'findFalcone',
  context: {
    planets: [],
    vehicles: [],
    result: null,
    selectedValues: [{ vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}]
  },
    initial: 'loading',
    states: {
      idle: {
        on: {
          SUBMIT: [
            {
              target: 'loading.findingFalcone',
              cond: isFormValid
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
                src: fetchPlanetsAndVehicles,
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
                src: findfalcone,
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

      },
      error: {

      }
   },
}, {
  actions: {
    updateVehiclesAndPlanets: assign<IFindingFalconeContext, FindingFalconeEvents>((ctx, event) => {
      return event.data
    }),
    updateSelectedVehicle: assign<IFindingFalconeContext, FindingFalconeEvents>((context, event) => {
      if (event.type !== 'UPDATE_SELECTED_VEHICLE') {
        return {}
      }

      const { selectedValues } = context;
      selectedValues[event.index].vehicle = event.value;

      return {
        selectedValues
      }
    }),
    updateSelectedPlanet: assign<IFindingFalconeContext, FindingFalconeEvents>((context, event) => {
      if (event.type !== 'UPDATE_SELECTED_VEHICLE') {
        return {}
      }

      const { selectedValues } = context;
      selectedValues[event.index].planet = event.value;

      return {
        selectedValues
      }
    }),
    updateResult: assign<IFindingFalconeContext, FindingFalconeEvents>((context, event) => {
      return {
        result: event.data
      }
    }),
  }
});

export default findFalconeMachine;

