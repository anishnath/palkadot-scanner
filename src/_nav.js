import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Scan Blocks',
    to: '/dashboard',
    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },
]

export default _nav
