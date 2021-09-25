import PropTypes from 'prop-types'
import React from 'react'
import { CCallout, CLink } from '@coreui/react'

import packageJson from '../../package.json'

const DocsCallout = (props) => {
  const { href, name } = props

  const plural = name.slice(-1) === 's' ? true : false

  const _href = `https://coreui.io/react/docs/${packageJson.config.coreui_library_short_version}/${href}`

  return (
    <CCallout color="info" className="bg-white">
      Polkadot Scanner
      <br />
      <br />
      polkadot.js documentation:
      <CLink href="https://polkadot.js.org/docs/api/examples/promise/system-events" target="_blank">
        api calls
      </CLink>
      .
    </CCallout>
  )
}

DocsCallout.propTypes = {
  href: PropTypes.string,
  name: PropTypes.string,
}

export default React.memo(DocsCallout)
