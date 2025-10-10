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
import SearchPage from '../components/SearchPage'
import TrendingPage from '../components/TrendingPage'
import UserProfile from '../components/UserProfile'
import FoodRecognition from '../components/FoodRecognition'
import FoodTrivia from '../components/FoodTrivia'
import FoodChallenges from '../components/FoodChallenges'
import LiveStreaming from '../components/LiveStreaming'
import FoodDelivery from '../components/FoodDelivery'
import FoodMap from '../components/FoodMap'

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
        <Route path="/search" element={<SearchPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/ai-recognition" element={<FoodRecognition />} />
        <Route path="/trivia" element={<FoodTrivia />} />
        <Route path="/challenges" element={<FoodChallenges />} />
        <Route path="/live" element={<LiveStreaming />} />
        <Route path="/delivery" element={<FoodDelivery />} />
        <Route path="/map" element={<FoodMap />} />
        <Route path="/test" element={<TestBackend />} />
        <Route path="/create-food" element={<CreateFood/>} />
      </Routes>
    </Router>
  )
}

export default AppRoutes