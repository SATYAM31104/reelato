import '../styles/auth.css'
import Shuffle from './Shuffle'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import createAuthenticatedAxios, { logoutWithMobileSupport } from '../utils/mobileAuth'

function GeneralPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  // Check authentication status
  const [userType, setUserType] = useState(null) // 'user' or 'foodPartner'

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Create mobile-friendly axios instance
        const authAxios = createAuthenticatedAxios()
        
        // Try to get user info to check if logged in
        const response = await authAxios.get('/api/auth/me')
        if (response.data) {
          setIsLoggedIn(true)
          setUserType(response.data.type) // 'user' or 'foodPartner'
          
          // Store auth state in localStorage for mobile
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('userType', response.data.type)
        }
      } catch (error) {
        // User not logged in, that's fine
        setIsLoggedIn(false)
        setUserType(null)
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userType')
      }
    }

    checkAuthStatus()
  }, [])

  // Fetch food items from backend
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE_URL}/api/food`)

        console.log('Food items response:', response.data)

        // Transform backend data to match our video format
        const transformedVideos = response.data.data.map((item, index) => ({
          id: item._id,
          title: item.name,
          videoUrl: item.video,
          description: item.description,
          restaurant: item.foodPartner?.restaurantName || 'Unknown Restaurant',
          ownerName: item.foodPartner?.ownerName || 'Unknown Owner',
          phone: item.foodPartner?.phone || 'N/A',
          email: item.foodPartner?.email || 'N/A',
          address: item.foodPartner?.address || 'N/A',
          restaurantId: item.foodPartner?._id || item.foodPartner,
          createdAt: item.createdAt,
          views: Math.floor(Math.random() * 50) + 'K', // Mock views for now
          likes: Math.floor(Math.random() * 10) + 'K'  // Mock likes for now
        }))

        setVideos(transformedVideos)
        setError('')
      } catch (error) {
        console.error('Error fetching food items:', error)
        setError('Failed to load food videos. Please try again.')
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchFoodItems()
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      {/* Header */}
      <header style={{
        padding: window.innerWidth > 768 ? '1rem 2rem' : '0.8rem 1rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--card-bg)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <Shuffle
            text="ReelBites"
            shuffleDirection="right"
            duration={0.3}
            triggerOnHover={true}
          />
          <nav style={{ 
            display: 'flex', 
            gap: window.innerWidth > 768 ? '2rem' : '1rem', 
            alignItems: 'center',
            flexWrap: 'wrap',
            fontSize: window.innerWidth > 768 ? '1rem' : '0.85rem'
          }}>
            <a href="/" style={{ color: 'var(--text-color)', textDecoration: 'none', whiteSpace: 'nowrap' }}>Home</a>
            <a href="/general" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600', whiteSpace: 'nowrap' }}>Browse</a>
            <a href="/feed" style={{ color: 'var(--text-color)', textDecoration: 'none', whiteSpace: 'nowrap' }}>Feed</a>

            {/* Food Partner Upload Option */}
            {isLoggedIn && userType === 'foodPartner' && (
              <a
                href="/create-food"
                style={{
                  color: '#ff6b6b',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  whiteSpace: 'nowrap',
                  fontSize: window.innerWidth > 768 ? '1rem' : '0.8rem'
                }}
              >
                🍽️ {window.innerWidth > 768 ? 'Upload Your Own Food' : 'Upload'}
              </a>
            )}

            <div style={{ 
              display: 'flex', 
              gap: window.innerWidth > 768 ? '1rem' : '0.5rem',
              marginLeft: 'auto'
            }}>
              {isLoggedIn ? (
                <button
                  onClick={async () => {
                    try {
                      await logoutWithMobileSupport()
                      setIsLoggedIn(false)
                      setUserType(null)
                      navigate('/')
                    } catch (error) {
                      console.error('Logout error:', error)
                    }
                  }}
                  className="btn-secondary"
                  style={{ 
                    padding: window.innerWidth > 768 ? '0.5rem 1rem' : '0.4rem 0.8rem', 
                    fontSize: window.innerWidth > 768 ? '0.9rem' : '0.8rem'
                  }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <a href="/user/login" className="btn-secondary" style={{ 
                    padding: window.innerWidth > 768 ? '0.5rem 1rem' : '0.4rem 0.8rem', 
                    fontSize: window.innerWidth > 768 ? '0.9rem' : '0.8rem',
                    whiteSpace: 'nowrap'
                  }}>Login</a>
                  <a href="/user/register" className="btn-primary" style={{ 
                    padding: window.innerWidth > 768 ? '0.5rem 1rem' : '0.4rem 0.8rem', 
                    fontSize: window.innerWidth > 768 ? '0.9rem' : '0.8rem',
                    whiteSpace: 'nowrap'
                  }}>Sign Up</a>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Discover Amazing Food Videos
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: '0.8', maxWidth: '600px', margin: '0 auto' }}>
            Watch short, engaging videos of delicious food from restaurants around you
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid #ff6b6b',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading delicious food videos...</p>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            marginBottom: '3rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😞</div>
            <h3 style={{ marginBottom: '1rem' }}>Oops! Something went wrong</h3>
            <p style={{ marginBottom: '2rem', opacity: 0.8 }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Video Grid */}
        {!loading && !error && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {videos.map((video) => (
              <div key={video.id} style={{
                backgroundColor: 'var(--card-bg)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onClick={() => navigate(`/restaurant/${video.restaurantId}`)}>

                {/* Video Thumbnail/Preview */}
                <div style={{
                  height: '250px',
                  position: 'relative',
                  backgroundColor: '#000'
                }}>
                  <video
                    src={video.videoUrl}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    muted
                    loop
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => e.target.pause()}
                    onError={(e) => {
                      // Fallback to gradient background if video fails
                      e.target.style.display = 'none'
                      e.target.parentElement.style.background = `linear-gradient(135deg, #ff6b6b, #feca57)`
                      e.target.parentElement.innerHTML += `
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem;">
                          🍽️
                        </div>
                      `
                    }}
                  />

                  {/* Play Button Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '1.5rem',
                    color: 'white'
                  }}>
                    ▶️
                  </div>

                  {/* Duration Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    0:{Math.floor(Math.random() * 40) + 15}
                  </div>
                </div>

                {/* Video Info */}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: 'var(--text-color)'
                  }}>
                    {video.title}
                  </h3>

                  <p style={{
                    margin: '0 0 1rem 0',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {video.description.length > 80
                      ? video.description.substring(0, 80) + '...'
                      : video.description
                    }
                  </p>

                  {/* Restaurant Info */}
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#ff6b6b'
                    }}>
                      🏪 {video.restaurant}
                    </h4>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <p style={{ margin: '0.25rem 0' }}>
                        👨‍🍳 <strong>Owner:</strong> {video.ownerName}
                      </p>
                      <p style={{ margin: '0.25rem 0' }}>
                        📞 <strong>Phone:</strong> {video.phone}
                      </p>
                      <p style={{ margin: '0.25rem 0' }}>
                        📧 <strong>Email:</strong> {video.email}
                      </p>
                      <p style={{ margin: '0.25rem 0' }}>
                        📍 <strong>Address:</strong> {video.address}
                      </p>
                    </div>
                  </div>

                  {/* Stats and Actions */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <span>👀 {video.views} views</span>
                      <span>❤️ {video.likes} likes</span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(video.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/feed')
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#ff5252'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
                    >
                      Watch Full Video
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/restaurant/${video.restaurantId}`)
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        color: '#ff6b6b',
                        border: '2px solid #ff6b6b',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#ff6b6b'
                        e.target.style.color = 'white'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'transparent'
                        e.target.style.color = '#ff6b6b'
                      }}
                    >
                      Visit Store
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Videos State */}
        {!loading && !error && videos.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            marginBottom: '3rem'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
            <h3 style={{ marginBottom: '1rem' }}>No Food Videos Yet</h3>
            <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
              Be the first to share your delicious creations!
            </p>
            <a href="/food-partner/register" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              Become a Food Partner
            </a>
          </div>
        )}

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '16px',
          marginTop: '3rem'
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>Ready to Join ReelBites?</h2>
          <p style={{ marginBottom: '2rem', opacity: '0.8' }}>
            Create an account to like, comment, and discover personalized food content
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/user/register" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
              Join as Food Lover
            </a>
            <a href="/food-partner/register" className="btn-secondary" style={{ padding: '0.75rem 2rem' }}>
              Join as Restaurant
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '4rem',
        padding: '2rem',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        <p>&copy; 2024 ReelBites. Made with ❤️ for food lovers.</p>
      </footer>
    </div>
  )
}

export default GeneralPage