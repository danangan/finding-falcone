import { createFindFalconeMachine }  from "./falconeMachine";
import {IApi} from "./api";
import {Event, interpret} from "xstate";

describe("findFalconeMachine", () => {
  it('should invoke api when transitioning into loading.fetchingPlanetsAndVehicles state',  function (done) {
    const mockApi = {
      fetchPlanetsAndVehicles: jest.fn(() => Promise.resolve({
        planets: ['a', 'b'],
        vehicles: ['c', 'd'],
      })),
      findFalcone: jest.fn(),
    };

    const mockMachine = createFindFalconeMachine(mockApi);

    const sut = interpret(mockMachine);

    sut.onTransition(state => {
      if(state.matches({loading:'fetchingPlanetsAndVehicles'})) {
        expect(mockApi.fetchPlanetsAndVehicles).toBeCalled();
        done();
      }
    });

    sut.start()
  });

  it('should transition into loading.findingFalcone state from idle state when SUBMIT event is dispatched',  function () {
    const mockApi = {
      fetchPlanetsAndVehicles: jest.fn(() => Promise.resolve({
        planets: ['a', 'b'],
        vehicles: ['c', 'd'],
      })),
      findFalcone: jest.fn(() => Promise.resolve({
        status: 'success',
        planet: 'planetA',
      })),
    };

    const mockMachine = createFindFalconeMachine(mockApi);

    const result = mockMachine.transition('idle' , {type: 'SUBMIT'});

    expect(result.matches({loading: 'findingFalcone'})).toBe(true)
  });

  it('should invoke finding falcone api when transitioning into loading.findingFalcone state',  function (done) {
    const mockApi = {
      fetchPlanetsAndVehicles: jest.fn(() => Promise.resolve({
        planets: ['planetA', 'planetB'],
        vehicles: ['vehicleB', 'vehicleC'],
      })),

      findFalcone: jest.fn(() => Promise.resolve({
        status: 'success',
        planet: 'planetA',
      })),
    };

    const mockMachine = createFindFalconeMachine(mockApi);

    const sut = interpret(mockMachine);

    sut.start();

    sut.onTransition(state => {
      if (state.matches('idle')) {
        sut.send('SUBMIT');

      }

      if (state.matches({loading: 'findingFalcone'})) {
        expect(mockApi.findFalcone).toBeCalledWith([]);
        done();
      }
    });
  });

  it('should assign returned value from api and transition into idle state',  function (done) {
    const mockApi = {
      fetchPlanetsAndVehicles: jest.fn(() => Promise.resolve({
        planets: ['planetA', 'planetB'],
        vehicles: ['vehicleA', 'vehicleB'],
      })),
      findFalcone: jest.fn(),
    };

    const mockMachine = createFindFalconeMachine(mockApi);

    const sut = interpret(mockMachine);

    sut.onTransition(state => {
      if(state.matches('idle')) {
        expect(state.context.planets).toEqual(['planetA', 'planetB']);
        expect(state.context.vehicles).toEqual(['vehicleA', 'vehicleB']);
        done();
      }
    });

    sut.start()
  });

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


