import { Route, Routes, useNavigate } from 'react-router-dom'
import { ConnectForm } from './components/ConnectForm'
import { LiveVideo } from './components/LiveVideo'

import AgoraRTC, {
  AgoraRTCProvider,
  useRTCClient,
} from "agora-rtc-react";

import './App.css'
import "sanitize.css"

function App() {
  const navigate = useNavigate()
  const agoraEngine = useRTCClient( AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })); // Initialize Agora Client

  const handleConnect = (channelName: string) => {
    navigate(`/${channelName}`) // on form submit, navigate to new route
  }

  return (
    <Routes>
      <Route path='/' element={ <ConnectForm connectToVideo={ handleConnect } /> } />
      <Route path='/:channelName' element={
        <AgoraRTCProvider client={agoraEngine}>
          <LiveVideo />
        </AgoraRTCProvider>
      } />
    </Routes>
  )
}

export default App
