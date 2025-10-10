import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../components/Home'
import UserRegister from '../components/UserRegister'
import UserLogin from '../components/UserLogin'
import FoodPartnerRegister from '../components/FoodPartnerRegister'
import FoodPartnerLogin from '../components/FoodPartnerLogin'
import GeneralPage from '../components/GeneralPage'
import TestBackend from '../components/TestBackend'
import CreateFood from '../components/createFood'
import HomePage from '../general/home'
import RestaurantStore from '../components/RestaurantStore'
import SavedVideos from '../components/SavedVideos'

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
        <Route path="/general" element={<GeneralPage />} />
        <Route path="/feed" element={<HomePage />} />
        <Route path="/restaurant/:restaurantId" element={<RestaurantStore />} />
        <Route path="/saved" element={<SavedVideos />} />
        <Route path="/test" element={<TestBackend />} />
        <Route path="/create-food" element={<CreateFood/>} />
      </Routes>
    </Router>
  )
}

export default AppRoutes