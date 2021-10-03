import React, { Component, createContext, useContext } from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import './scss/style.scss'
import ScanBlock from './views/dashboard/ScanBlock'
import Auth from './Auth/Auth'
import Router from './Router'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))

//const { state } = useOvermind()

// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={(props) =>
//       Auth.getAuth() ? (
//         <Component {...props} />
//       ) : (
//         <Redirect
//           to={{
//             pathname: '/',
//           }}
//         />
//       )
//     }
//   />
// )

// function PrivateRoute({ children, ...rest }) {
//   let auth = useAuth()
//   return (
//     <Route
//       {...rest}
//       render={({ location }) =>
//         auth.user ? (
//           children
//         ) : (
//           <Redirect
//             to={{
//               pathname: '/login',
//               state: { from: location },
//             }}
//           />
//         )
//       }
//     />
//   )
// }

class App extends Component {
  render() {
    return <Router />
  }
}

export default App
