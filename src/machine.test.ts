import { createFindFalconeMachine }  from "./falconeMachine";
import { interpret } from '@xstate/fsm';

describe("findFalconeMachine", () => {
  it('should fetch the planets and vehicles during machine initial ',  function (done) {
    const mockApi = {
      fetchPlanetsAndVehicles: jest.fn(),
      findFalcone: jest.fn(),
    };

    const mockMachine = createFindFalconeMachine(mockApi);

    const sut = mockMachine.transition('loading', { type: 'DONE', data: {
      planets: ['a', 'b'],
        vehicles: ['a', 'b']
      }});

    expect(sut.context.planets).toBe('wow');
    expect(sut.context.vehicles).toBe('wow');
  });

  describe('idle state', function() {
    it('UPDATE_SELECTED_VEHICLE should update selected vehicle',  function () {
      const mockApi = {
        fetchPlanetsAndVehicles: jest.fn(() => {
          return {
            planets: [],
            vehicles: [],
          }
        }),
        findFalcone: jest.fn(),
      };

      const mockMachine = createFindFalconeMachine(mockApi);

      // const service = interpret(mockMachine);
      //
      // service.start();

      const sut = mockMachine.transition('idle', { type: 'UPDATE_SELECTED_VEHICLE', index: 0, value: 'wow'});

      expect(sut.context.selectedValues[0].vehicle).toBe('wow');
    });
  })

  describe('finish state', function() {
    it('RESET should move to idle state',  function () {
      const mockApi = {
        fetchPlanetsAndVehicles: jest.fn(() => {
          return {
            planets: [],
            vehicles: [],
          }
        }),
        findFalcone: jest.fn(),
      };

      const mockMachine = createFindFalconeMachine(mockApi);

      // const service = interpret(mockMachine);
      //
      // service.start();
      const sut = mockMachine.transition('finish', { type: 'RESET'});

      expect(sut.matches('idle')).toBe(true);
    });

    it('RESET should reset context',  function () {
      const mockApi = {
        fetchPlanetsAndVehicles: jest.fn(() => {
          return {
            planets: [],
            vehicles: [],
          }
        }),
        findFalcone: jest.fn(),
      };

      const mockMachine = createFindFalconeMachine(mockApi, {
        planets: [1,2,3,4],
        vehicles: [1,2,3,4],
        result: null,
        selectedValues: [{ vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}]
      });

      // const service = interpret(mockMachine);
      //
      // service.start();
      const sut = mockMachine.transition('finish', { type: 'RESET'});

      expect(sut.context).toEqual({
        planets: [],
        vehicles: [],
        result: null,
        selectedValues: [{ vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}]
      });
    });
  })
});


