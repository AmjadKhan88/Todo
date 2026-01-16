import { Toaster } from "react-hot-toast"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import ReminderNotifications from "./components/ReminderNotifications"

function App() {
  return (
    <div>

     <Toaster/>

     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/notifications" element={<ReminderNotifications />} />
     </Routes>
      
    </div>
  )
}

export default App
