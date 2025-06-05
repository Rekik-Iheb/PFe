import { useState } from 'react'
import AppRoutes from './routes/AppRoutes'
import { BrowserRouter } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    < >

      <BrowserRouter>
        <AppRoutes></AppRoutes>
      </BrowserRouter>
    </>
  )
}

export default App
