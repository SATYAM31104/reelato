import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import createAuthAxios, { isAuthenticated, getUserType, logout } from '../utils/reliableAuth'

const SavedVideos = () => {
    const navigate = useNavigate()
    const [savedVideos, setSavedVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userType, setUserType] = useState(null)

    // Simple auth check
    useEffect(() => {
        setIsLoggedIn(isAuthenticated())
        setUserType(getUserType())
        
        if (!isAuthenticated()) {
            navigate('/')
            return
                    navigate('/')
                }
            }
        }
        checkAuthStatus()
    }, [navigate])

    // Fetch saved videos
    useEffect(() => {
        const fetchSavedVideos = async () => {
            if (!isLoggedIn) return

            try {
                setLoading(true)
                console.log('Fetching saved videos...')
                console.log('User logged in:', isLoggedIn)
                console.log('User type:', userType)
                
                const authAxios = createAuthAxios()
                const response = await authAxios.get('/api/food/saved')
                
                console.log('Saved videos response:', response.data)
                console.log('Response status:', response.status)
                setSavedVideos(response.data.data || [])
                setError('')
            } catch (error) {
                console.error('Error fetching saved videos:', error)
                console.error('Error response:', error.response)
                console.error('Error status:', error.response?.status)
                console.error('Error message:', error.response?.data?.message)
                
                if (error.response?.status === 401) {
                    // Token expired, clear auth state
                    setIsLoggedIn(false)
                    setUserType(null)
                    localStorage.removeItem('isLoggedIn')
                    localStorage.removeItem('userType')
                    navigate('/')
                } else {
                    setError(`Failed to load saved videos: ${error.response?.data?.message || error.message}`)
                }
                setSavedVideos([])
            } finally {
                setLoading(false)
            }
        }

        fetchSavedVideos()
    }, [isLoggedIn, navigate])

    // Handle unsave
    const handleUnsave = async (foodId) => {
        try {
            const authAxios = createAuthAxios()
            await authAxios.post('/api/food/save', { foodId })
            
            // Remove from saved videos
            setSavedVideos(prev => prev.filter(video => video.id !== foodId))
        } catch (error) {
            console.error('Error unsaving video:', error)
        }
    }

    if (!isLoggedIn) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#000',
                color: 'white',
                flexDirection: 'column'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
                <h2>Please Login</h2>
                <p style={{ opacity: 0.8, marginBottom: '2rem' }}>You need to login to view saved videos</p>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '12px 24px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    Go to Login
                </button>
            </div>
        )
    }

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#000',
                color: 'white'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '3px solid #feca57',
                        borderTop: '3px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '1rem'
                    }}></div>
                    <p>Loading saved videos...</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ 
            backgroundColor: '#000', 
            minHeight: '100vh', 
            color: 'white',
            paddingBottom: '80px'
        }}>
            {/* Header */}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid #333',
                position: 'sticky',
                top: 0,
                backgroundColor: '#000',
                zIndex: 100
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <button
                        onClick={() => navigate('/feed')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                    >
                        ←
                    </button>
                    <h1 style={{ 
                        margin: 0, 
                        fontSize: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        🔖 Saved Videos
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '20px' }}>
                {error && (
                    <div style={{
                        backgroundColor: '#ff4757',
                        color: 'white',
                        padding: '15px',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {error}
                        <div style={{ marginTop: '10px' }}>
                            <button
                                onClick={async () => {
                                    try {
                                        const authAxios = createAuthAxios()
                                        const response = await authAxios.get('/api/food/test-auth')
                                        console.log('Auth test response:', response.data)
                                        alert('Authentication test successful!')
                                    } catch (error) {
                                        console.error('Auth test failed:', error)
                                        alert('Authentication test failed: ' + (error.response?.data?.message || error.message))
                                    }
                                }}
                                style={{
                                    backgroundColor: '#fff',
                                    color: '#ff4757',
                                    border: 'none',
                                    borderRadius: '5px',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                            >
                                Test Auth
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const authAxios = createAuthAxios()
                                        const response = await authAxios.get('/api/food/saved-simple')
                                        console.log('Simple saved test response:', response.data)
                                        alert(`Simple test successful! Found ${response.data.count} saves`)
                                    } catch (error) {
                                        console.error('Simple saved test failed:', error)
                                        alert('Simple test failed: ' + (error.response?.data?.message || error.message))
                                    }
                                }}
                                style={{
                                    backgroundColor: '#fff',
                                    color: '#ff4757',
                                    border: 'none',
                                    borderRadius: '5px',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                            >
                                Test Simple
                            </button>
                            <button
                                onClick={() => {
                                    setError('')
                                    window.location.reload()
                                }}
                                style={{
                                    backgroundColor: '#fff',
                                    color: '#ff4757',
                                    border: 'none',
                                    borderRadius: '5px',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {savedVideos.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: '#666'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📑</div>
                        <h2 style={{ marginBottom: '10px', color: 'white' }}>No Saved Videos</h2>
                        <p style={{ marginBottom: '30px' }}>
                            Start saving videos you love to watch them later!
                        </p>
                        <button
                            onClick={() => navigate('/feed')}
                            style={{
                                backgroundColor: '#feca57',
                                color: '#000',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '12px 24px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Discover Videos
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                        gap: '15px'
                    }}>
                        {savedVideos.map((video) => (
                            <div
                                key={video.id}
                                style={{
                                    position: 'relative',
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(`/restaurant/${video.restaurantId}`)}
                            >
                                {/* Video Thumbnail */}
                                <div style={{
                                    position: 'relative',
                                    paddingBottom: '177.78%', // 9:16 aspect ratio
                                    backgroundColor: '#333'
                                }}>
                                    <video
                                        src={video.videoUrl}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        muted
                                        onMouseEnter={(e) => e.target.play()}
                                        onMouseLeave={(e) => e.target.pause()}
                                    />
                                    
                                    {/* Play Button Overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px'
                                    }}>
                                        ▶️
                                    </div>

                                    {/* Unsave Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUnsave(video.id)
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            background: 'rgba(0, 0, 0, 0.7)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '30px',
                                            height: '30px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        🗑️
                                    </button>

                                    {/* Stats Overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '8px',
                                        left: '8px',
                                        right: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '12px',
                                        color: 'white'
                                    }}>
                                        <span>❤️ {video.likeCount || 0}</span>
                                        <span>💬 {video.commentCount || 0}</span>
                                    </div>
                                </div>

                                {/* Video Info */}
                                <div style={{ padding: '12px' }}>
                                    <h3 style={{
                                        margin: '0 0 5px 0',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        lineHeight: '1.2',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {video.foodName}
                                    </h3>
                                    <p style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '12px',
                                        color: '#999',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        @{video.restaurantName}
                                    </p>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '11px',
                                        color: '#666',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        lineHeight: '1.3'
                                    }}>
                                        {video.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '70px',
                backgroundColor: '#000',
                borderTop: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                zIndex: 1000
            }}>
                <button
                    onClick={() => navigate('/feed')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    🏠
                    <span style={{ fontSize: '10px' }}>Home</span>
                </button>

                <button
                    onClick={() => navigate('/saved')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#feca57',
                        fontSize: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    🔖
                    <span style={{ fontSize: '10px' }}>Saved</span>
                </button>

                {userType === 'foodPartner' && (
                    <button
                        onClick={() => navigate('/create-food')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        ➕
                        <span style={{ fontSize: '10px' }}>Upload</span>
                    </button>
                )}

                <button
                    onClick={() => navigate('/general')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    🔍
                    <span style={{ fontSize: '10px' }}>Browse</span>
                </button>

                <button
                    onClick={async () => {
                        try {
                            logout()
                            setUserType(null)
                            localStorage.removeItem('isLoggedIn')
                            localStorage.removeItem('userType')
                            navigate('/')
                        } catch (error) {
                            console.error('Logout error:', error)
                        }
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    👤
                    <span style={{ fontSize: '10px' }}>Profile</span>
                </button>
            </div>

            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    )
}

export default SavedVideos