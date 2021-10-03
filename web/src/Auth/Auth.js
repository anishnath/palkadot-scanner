import { createContext, useContext } from 'react'

const authContext = createContext()

function useAuth() {
  return useContext(authContext)
}

const Auth = {
  isAuthenticated: false,
  authenticate() {
    this.isAuthenticated = true
  },
  signout() {
    this.isAuthenticated = false
  },
  getAuth() {
    return this.isAuthenticated
  },
}

export default Auth
