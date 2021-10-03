import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import BlockDetails from './BlockDetails'
import Auth from '../../Auth/Auth'

const ScanBlock = (props) => {
  const [validated, setValidated] = useState(false)
  const [start, setStart] = useState(6898275)
  const [end, setEnd] = useState(6898289)
  const [websocket, setWebsocket] = useState('wss://rpc.polkadot.io')
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [data, setData] = useState([])
  const [timeInterval, setTimeInterval] = useState(0)

  if (!Auth.isAuthenticated) {
    props.history.push('/login')
  }

  setTimeout(() => {
    setTimeInterval(timeInterval + 1)
  }, 20000)

  useEffect(async () => {
    const result = await axios(
      'http://localhost:3000/api/rpc/chain/getHeader?websocket=' + websocket,
    )
    console.log(result.data.result.number)
    setEnd(result.data.result.number)
  }, [timeInterval])

  function ProgressBar(props) {
    if (isLoaded) {
      return (
        <CButton disabled>
          <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
          Loading...
        </CButton>
      )
    }
    return ''
  }

  function handleChange(e) {
    const { name, value } = e.target
    switch (name) {
      case 'start':
        setStart(e.target.value)
        break
      case 'end':
        setEnd(e.target.value)
        break
    }
    e.preventDefault()
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
      setValidated(true)
      return
    }
    //compare start block and end block
    if (parseFloat(start) > parseFloat(end)) {
      event.preventDefault()
      event.stopPropagation()
      setValidated(false)
      setError('End block Should be greater than start Block')
      return
    }

    event.preventDefault()
    event.stopPropagation()
    setIsLoaded(true)
    axios
      .get(
        'http://localhost:3000/api/scan/chain?websocket=' +
          websocket +
          '&start_block=' +
          start +
          '&end_block=' +
          end,
      )
      .then((res) => {
        setIsLoaded(false)
        setData(res.data.result)
      })
      .catch((error) => {
        console.log(error)
      })
    setValidated(true)
  }

  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Search the Block Range</strong>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <CFormLabel htmlFor="start_block">Start Block</CFormLabel>
                <CFormInput
                  type="number"
                  id="start_block"
                  name="start"
                  placeholder="6898275"
                  onChange={handleChange}
                  required
                />
                <CFormFeedback invalid>Please input a valid start Block</CFormFeedback>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="end_block">End Block</CFormLabel>
                <CFormInput
                  type="number"
                  id="end_block"
                  name="end"
                  placeholder="6898289"
                  value={end}
                  onChange={handleChange}
                  required
                />
                <CFormFeedback invalid>Please input a valid end Block.</CFormFeedback>
              </div>
              <div className="mb-3">
                <CFormSelect aria-label="Endpoint" required>
                  <option value="wss://rpc.polkadot.io">Polkascan Main Net</option>
                </CFormSelect>
              </div>
              <CButton color="primary" type="submit">
                Scan
              </CButton>
              <br />
              <ProgressBar isLoaded={isLoaded} />,
              <BlockDetails data={data} isloaded={isLoaded} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CForm>
  )
}

export default ScanBlock
