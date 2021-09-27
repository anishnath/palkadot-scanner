import React, { Component } from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import './scss/style.scss'
import Dashboard from './views/dashboard/Dashboard'
import Auth from './Auth/Auth'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      Auth.getAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/',
          }}
        />
      )
    }
  />
)

class App extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route exact path="/login" name="Login Page" render={(props) => <Login {...props} />} />
            {/*<Route path="/" name="Home" render={(props) => <DefaultLayout {...props} />} />*/}
            <Route exact path="/" name="Login Page" render={(props) => <Login {...props} />} />
            <PrivateRoute
              path="/dashboard"
              name="Dashboard Page"
              render={(props) => <Dashboard {...props} />}
            />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default App
