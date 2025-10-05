import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../components/Home'
import UserRegister from '../components/UserRegister'
import UserLogin from '../components/UserLogin'
import FoodPartnerRegister from '../components/FoodPartnerRegister'
import FoodPartnerLogin from '../components/FoodPartnerLogin'

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes