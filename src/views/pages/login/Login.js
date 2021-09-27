import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios'
import qs from 'qs'
import Auth from '../../../Auth/Auth'

const Login = () => {
  const [validated, setValidated] = useState(false)
  const [error, setError] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setError(null)
    switch (name) {
      case 'username':
        setUsername(e.target.value)
        break
      case 'password':
        setPassword(e.target.value)
        break
    }
    e.preventDefault()
  }

  const handleSubmit = (event) => {
    const bodyFormData = new FormData()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
      setValidated(true)
      setError(null)
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const data = qs.stringify({
      password: password,
      username: username,
    })

    const config = {
      method: 'post',
      url: 'http://localhost:3000/api/login',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    }

    axios(config)
      .then(function (response) {
        setError(null)
        console.log(JSON.stringify(response.data))
        //store.set('loggedIn', true)
        // eslint-disable-next-line no-restricted-globals
        Auth.authenticate()
      })
      .catch(function (error) {
        setError('Invalid User Name and Password')
        console.log(error)
      })
    setError(null)
    setValidated(true)
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    className="row g-3 needs-validation"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        id="username"
                        name="username"
                        placeholder="Username"
                        autoComplete="username"
                        onChange={handleChange}
                        required
                      />
                      <CFormFeedback invalid>Please input Username</CFormFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={handleChange}
                        required
                      />
                      <CFormFeedback invalid>Please input password</CFormFeedback>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" type="submit" className="px-4">
                          Login
                        </CButton>
                        {error}
                      </CCol>
                    </CRow>
                    {/*<CRow>*/}
                    {/*  <CCol xs={6}>{error}</CCol>*/}
                    {/*</CRow>*/}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
