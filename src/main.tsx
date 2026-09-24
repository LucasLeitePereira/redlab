import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './index.css'

// Sem StrictMode: o mount duplo do modo dev faz os <Html> do drei recriarem seus roots à toa.
createRoot(document.getElementById('root')!).render(<App />)
