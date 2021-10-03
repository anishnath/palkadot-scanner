import { CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react'
import React from 'react'

function EmptyBlockDetails(props) {
  return (
    <CTableRow>
      <CTableHeaderCell scope="row">1</CTableHeaderCell>
      <CTableDataCell colSpan={3}>NO DATA FOUND</CTableDataCell>
    </CTableRow>
  )
}

export default EmptyBlockDetails
