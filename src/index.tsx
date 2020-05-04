import React from 'react'
import ReactDOM from 'react-dom'
import styles from './styles.module.scss'
import falconeMachine from './falconeMachine'
import { useMachine } from '@xstate/react'
import {ISelectedValues} from './types'

function getUsedVehicleByName(vehicleName: string, selectedValues: Array<ISelectedValues>) {
  return selectedValues.reduce((prevValue, selectedValue) => {
    if (selectedValue.vehicle === vehicleName) {
      return prevValue + 1;
    }
    return prevValue;
  },0)
}

function Layout(props) {
  return (
    <div>
      <h1>Find Falcone</h1>
      {props.children}
    </div>
  )
}

function App() {
  const [state, send] = useMachine(falconeMachine, {
    devTools: true,
  })

  let content

  const { context: {
    planets,
    vehicles,
    selectedValues,
    result
  }} = state;

  switch (true) {
    case state.matches('idle'):
      content = (
        <div>
          {
            [0,1,2,3].map((_, idx) =>
            {
              const selectedPlanets = selectedValues.map(i => i.planet).filter(i => i !== '');

              return (
                <div style={{display: "block"}} key={idx}>
                  Destination {idx + 1}
                  <select value={selectedValues[idx].planet} onChange={(e) => send('UPDATE_SELECTED_PLANET', {
                    value: e.target.value,
                    index: idx
                  })}>
                    <option value="">-</option>
                    {planets.filter(planet => !selectedPlanets.filter(i => i!== selectedValues[idx].planet).includes(planet.name)).map(planet =>
                      <option key={planet.name} value={planet.name}>{planet.name}</option>
                    )}
                  </select>
                  {
                    selectedValues[idx].planet !== '' &&
                    vehicles.map(vehicle => {
                      const availableVehiclesNumber = vehicle.total_no - getUsedVehicleByName(vehicle.name, selectedValues);
                      return (<>
                        <input type="radio" name={'vehicle_destination_' + idx} value={selectedValues[idx].vehicle}
                               onClick={(e) => send('UPDATE_SELECTED_VEHICLE', {
                                 value: vehicle.name,
                                 index: idx
                               })} disabled={availableVehiclesNumber === 0} checked={selectedValues[idx].vehicle === vehicle.name}/>
                        <label for={'vehicle_destination_' + idx}>{vehicle.name} ({vehicle.total_no})</label>
                      </>)
                    })
                  }
                </div>
              )
            })
          }
          <button onClick={() => send('SUBMIT')}>Submit</button>
        </div>
      )
      break
    case state.matches('loading'):
      content = <span>loading</span>
      break
    case state.matches('error'):
      content = <span>error</span>
      break
    case state.matches('finish'):
      content = <div>Finish. Result: {JSON.stringify(result)} <button onClick={() => send('RESET')}>reset</button></div>
      break
    default:
      break
  }

  return <Layout>{content}</Layout>
}

const container = document.getElementById('root')

ReactDOM.render(<App />, container)
