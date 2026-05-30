import { useState } from 'react'
import Landing from './Landing.jsx'
import Tool from './Tool.jsx'

export default function App() {
  const [page, setPage] = useState('landing')
  return page === 'landing'
    ? <Landing onStart={() => setPage('tool')} />
    : <Tool onBack={() => setPage('landing')} />
}
