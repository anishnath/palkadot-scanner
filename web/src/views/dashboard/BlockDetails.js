import React from 'react'
import {
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import BlockDetailsRow from './BlockDetailsRow'
import EmptyBlockDetails from './EmptyBlockDetails'

const BlockDetails = (props) => {
  function displayData() {
    const blockScanData = []
    console.log(props.flag)

    if (props.data.length === 0 && props.flag === false) {
      blockScanData.push(<EmptyBlockDetails />)
    } else {
      props.data.forEach((blockdetails, i) => {
        blockScanData.push(<BlockDetailsRow data={blockdetails} key={i} />)
      })
    }
    return blockScanData
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CTable responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">ParentHash</CTableHeaderCell>
              <CTableHeaderCell scope="col">StateRoot</CTableHeaderCell>
              <CTableHeaderCell scope="col">ExtrinsicsRoot</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>{displayData()}</CTableBody>
        </CTable>
      </CCol>
    </CRow>
  )
}
export default BlockDetails
