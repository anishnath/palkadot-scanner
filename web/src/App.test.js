import React from 'react'
import { shallow } from 'enzyme/build'
import App from './App'
import ScanBlock from './views/dashboard/ScanBlock'

it('mounts App without crashing', () => {
  const wrapper = shallow(<App />)
  wrapper.unmount()
})

it('mounts Dashboard without crashing', () => {
  const wrapper = shallow(<ScanBlock />)
  wrapper.unmount()
})
