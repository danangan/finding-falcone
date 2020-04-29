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

  switch (true) {
    case state.matches('idle'):
      content = <span>idle</span>
      break
    case state.matches('loading'):
      content = <span>loading</span>
      break
    case state.matches('error'):
      content = <span>error</span>
      break
    default:
      break
  }

  return <Layout>{content}</Layout>
}

const container = document.getElementById('root')

ReactDOM.render(<App />, container)
