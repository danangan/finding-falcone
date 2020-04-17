import { createMachine, assign } from 'xstate';
import {fetchPlanets, fetchToken, fetchVehicles, findfalcone} from "./api";
import { isFormValid } from "./selector";
import {IFindingFalconeContext, FindingFalconeEvent} from "./types";


const findingFalconeMachine = createMachine<IFindingFalconeContext, FindingFalconeEvent>({
  id: 'findingFalcone',
  context: {
    token: '',
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
          initial: 'fetchingToken',
          states: {
            fetchingToken: {
              invoke: {
                src: fetchToken(),
                onDone: {
                  target: 'fetchingPlanetsAndVehicles'
                },
                onError: {
                  target: '#findingFalcone.error'
                }
              }
            },
            fetchingPlanetsAndVehicles: {

            },
            findingFalcone: {

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
    updateToken: assign<IFindingFalconeContext, FindingFalconeEvent>(((context, event) => ({
      token: event.data
    }))),
    updateSelectedVehicle: assign<IFindingFalconeContext, FindingFalconeEvent>((context, event) => {
      if (event.type !== 'UPDATE_SELECTED_VEHICLE') {
        return {}
      }

      const { selectedValues } = context;
      selectedValues[event.index].vehicle = event.value;

      return {
        selectedValues
      }
    }),
    updateSelectedPlanet: assign<IFindingFalconeContext, FindingFalconeEvent>((context, event) => {
      if (event.type !== 'UPDATE_SELECTED_VEHICLE') {
        return {}
      }

      const { selectedValues } = context;
      selectedValues[event.index].planet = event.value;

      return {
        selectedValues
      }
    })
  }
});
