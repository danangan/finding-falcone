import { createMachine } from 'xstate';

const falconeMachine = createMachine({
   context: {
      selectedValues: [
         {

         },
         {

         }
      ]
   },
   states: {
      preparation: {
         states: {
            fetchingToken: {

            },
            fetchingVehiclesAndPlanets: {

            }
         }
      },
      idle: {

      },
      loading: {
         states: {
            planetAndVehicles: {

            },
            findingFalcone: {

            }
         }
      },
      finish: {

      },
      error: {

      }
   }
});
