import React from 'react'

const ScanBlock = React.lazy(() => import('./views/dashboard/ScanBlock'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/scanblock', name: 'Dashboard', component: ScanBlock },
]

export default routes
