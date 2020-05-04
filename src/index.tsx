import React from 'react'
import ReactDOM from 'react-dom'
import styles from './styles.module.scss'
import falconeMachine from './falconeMachine'
import { useMachine } from '@xstate/react'

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



  console.log(state);

  const { context: {
    planets,
    vehicles,
    selectedValues
  }} = state;

  switch (true) {
    case state.matches('idle'):
      // @ts-ignore
      // @ts-ignore
      content = (
        <div>
          {
            [0,1,2,3].map((_, idx) =>
              <div style={{ display: "block" }} key={idx}>
                Destination {idx + 1}
                <select value={selectedValues[idx].planet} onChange={(e) => send('UPDATE_SELECTED_PLANET', {
                  value: e.target.value,
                  index: idx
                })}>
                  <option value="" >-</option>
                  {planets.map(planet =>
                    <option key={planet.name} value={planet.name} >{planet.name}</option>
                  )}
                </select>
                {
                vehicles.map(vehicle => <>
                  <input type="radio" name={'vehicle_destination_' + idx} value={selectedValues[idx].vehicle} onClick={(e) => send('UPDATE_SELECTED_VEHICLE', {
                    value: vehicle.name,
                    index: idx
                  })}/>
                  <label for={'vehicle_destination_' + idx}>{vehicle.name} ({vehicle.totalNo})</label>
                  </>)
                }
              </div>)
          }
          <button onclick={() => send('SUBMIT')}>Submit</button>
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
      content = <span>finish</span>
      break
    default:
      break
  }

  return <Layout>{content}</Layout>
}

const container = document.getElementById('root')

ReactDOM.render(<App />, container)
