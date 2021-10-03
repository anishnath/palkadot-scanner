import { CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react'
import React from 'react'

function BlockDetailsRow(props) {
  return (
    <CTableRow aria-setsize={10}>
      <CTableHeaderCell key={props.i} scope="row" className="overflow-auto">
        {props.data.result.number}
      </CTableHeaderCell>
      <CTableDataCell className="overflow-auto">
        <code>{props.data.result.parentHash}</code>
      </CTableDataCell>
      <CTableDataCell className="overflow-auto">{props.data.result.stateRoot}</CTableDataCell>
      <CTableDataCell className="overflow-auto">{props.data.result.extrinsicsRoot}</CTableDataCell>
    </CTableRow>
  )
}
export default BlockDetailsRow
