import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="https://github.com/anishnath" target="_blank" rel="noopener noreferrer">
          Maintainer
        </a>
        <span className="ms-1">Anish Nath</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://github.com/anishnath" target="_blank" rel="noopener noreferrer">
          Palkadot scanner
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
