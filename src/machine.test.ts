import { createFindFalconeMachine }  from "./falconeMachine";
import {IApi} from "./api";
import {Event} from "xstate";

describe("findFalconeMachine", () => {
  it('initial state should be loading state',  function () {
    const mockApi = {
      fetchPlanetsAndVehicles: jest.fn(() => Promise.resolve({
        planets: ['a', 'b'],
        vehicles: ['c', 'd'],
      })),
      findFalcone: jest.fn(),
    };

    const mockMachine = createFindFalconeMachine(mockApi);

    const {initialState} = mockMachine;

    expect(initialState.matches('loading')).toBe(true);
  });

  describe('idle state', function() {
    it('UPDATE_SELECTED_VEHICLE should update selected vehicle',  function () {
      const mockApi = {
        fetchPlanetsAndVehicles: jest.fn(),
        findFalcone: jest.fn(),
      };

      const mockMachine = createFindFalconeMachine(mockApi as IApi);

      const sut = mockMachine.transition('idle', { type: 'UPDATE_SELECTED_VEHICLE', index: 0, value: 'wow'});

      expect(sut.context.selectedValues[0].vehicle).toBe('wow');
    });
  });

  describe('finish state', function() {
    it('RESET event should move to idle state',  function () {
      const mockApi = {
        fetchPlanetsAndVehicles: jest.fn(),
        findFalcone: jest.fn(),
      };

      const mockMachine = createFindFalconeMachine(mockApi as IApi);

      const sut = mockMachine.transition('finish', { type: 'RESET'} as Event<any>);

      expect(sut.matches('idle')).toBe(true);
    });

    it('RESET event should reset context',  function () {
      const mockApi = {
        fetchPlanetsAndVehicles: jest.fn(),
        findFalcone: jest.fn(),
      };

      const mockMachine = createFindFalconeMachine(mockApi as IApi, {
        planets: [{name: 'any_planet', distance: 1},{name: 'any_planet', distance: 1},{name: 'any_planet', distance: 1},{name: 'any_planet', distance: 1}],
        vehicles: [{name: 'any_vehicle', total_no: 1, speed: 1, max_distance: 1},{name: 'any_vehicle', total_no: 1, speed: 1, max_distance: 1},{name: 'any_vehicle', total_no: 1, speed: 1, max_distance: 1},{name: 'any_vehicle', total_no: 1, speed: 1, max_distance: 1}],
        result: null,
        selectedValues: [{ vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}]
      });

      const sut = mockMachine.transition('finish', { type: 'RESET'} as Event<any>);

      expect(sut.context).toEqual({
        planets: [],
        vehicles: [],
        result: null,
        selectedValues: [{ vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}, {vehicle: '', planet: ''}]
      });
    });
  })
});


