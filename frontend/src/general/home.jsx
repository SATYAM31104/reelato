import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const HomePage = () => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
    const containerRef = useRef(null)
    const navigate = useNavigate()
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userType, setUserType] = useState(null)
    const [likes, setLikes] = useState({})
    const [saves, setSaves] = useState({})
    const [showComments, setShowComments] = useState(false)
    const [comments, setComments] = useState({})
    const [newComment, setNewComment] = useState('')

    // Check authentication status
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/auth/me', {
                    withCredentials: true
                })
                if (response.data) {
                    setIsLoggedIn(true)
                    setUserType(response.data.type)

                    // Store auth state in localStorage for persistence
                    localStorage.setItem('isLoggedIn', 'true')
                    localStorage.setItem('userType', response.data.type)
                }
            } catch (error) {
                // Check localStorage for auth state
                const storedAuth = localStorage.getItem('isLoggedIn')
                const storedUserType = localStorage.getItem('userType')

                if (storedAuth === 'true' && storedUserType) {
                    setIsLoggedIn(true)
                    setUserType(storedUserType)
                } else {
                    setIsLoggedIn(false)
                    setUserType(null)
                    localStorage.removeItem('isLoggedIn')
                    localStorage.removeItem('userType')
                }
            }
        }
        checkAuthStatus()
    }, [])

    // Fetch food items from backend
    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                setLoading(true)
                const response = await axios.get('http://localhost:3000/api/food')

                const transformedVideos = response.data.data.map((item) => ({
                    id: item._id,
                    videoUrl: item.video,
                    description: item.description,
                    restaurantName: item.foodPartner?.restaurantName || 'Unknown Restaurant',
                    restaurantId: item.foodPartner?._id || item.foodPartner,
                    foodName: item.name,
                    createdAt: item.createdAt,
                    likeCount: item.likeCount || 0,
                    commentCount: item.commentCount || 0,
                    saveCount: item.saveCount || 0
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

    // Handle like/unlike
    const handleLike = async (foodId) => {
        if (!isLoggedIn) {
            alert('Please login to like videos')
            return
        }

        try {
            const response = await axios.post('http://localhost:3000/api/food/like',
                { foodId },
                { withCredentials: true }
            )

            setLikes(prev => ({
                ...prev,
                [foodId]: response.data.liked
            }))

            // Update video like count
            setVideos(prev => prev.map(video =>
                video.id === foodId
                    ? { ...video, likeCount: video.likeCount + (response.data.liked ? 1 : -1) }
                    : video
            ))
        } catch (error) {
            console.error('Error liking food:', error)
            if (error.response?.status === 401) {
                // Token expired, clear auth state
                setIsLoggedIn(false)
                setUserType(null)
                localStorage.removeItem('isLoggedIn')
                localStorage.removeItem('userType')
                alert('Session expired. Please login again.')
            }
        }
    }

    // Handle save/unsave
    const handleSave = async (foodId) => {
        if (!isLoggedIn) {
            alert('Please login to save videos')
            return
        }

        try {
            const response = await axios.post('http://localhost:3000/api/food/save',
                { foodId },
                { withCredentials: true }
            )

            setSaves(prev => ({
                ...prev,
                [foodId]: response.data.saved
            }))

            setVideos(prev => prev.map(video =>
                video.id === foodId
                    ? { ...video, saveCount: video.saveCount + (response.data.saved ? 1 : -1) }
                    : video
            ))
        } catch (error) {
            console.error('Error saving food:', error)
            if (error.response?.status === 401) {
                // Token expired, clear auth state
                setIsLoggedIn(false)
                setUserType(null)
                localStorage.removeItem('isLoggedIn')
                localStorage.removeItem('userType')
                alert('Session expired. Please login again.')
            }
        }
    }

    // Handle comments
    const handleComment = async (foodId) => {
        if (!isLoggedIn) {
            alert('Please login to comment')
            return
        }
        setShowComments(true)

        try {
            const response = await axios.get(`http://localhost:3000/api/food/comments/${foodId}`)
            setComments(prev => ({
                ...prev,
                [foodId]: response.data.comments
            }))
        } catch (error) {
            console.error('Error fetching comments:', error)
        }
    }

    // Add comment
    const addComment = async (foodId) => {
        if (!newComment.trim()) return

        try {
            await axios.post('http://localhost:3000/api/food/comment',
                { foodId, text: newComment },
                { withCredentials: true }
            )

            setNewComment('')
            // Refresh comments
            handleComment(foodId)

            // Update comment count
            setVideos(prev => prev.map(video =>
                video.id === foodId
                    ? { ...video, commentCount: video.commentCount + 1 }
                    : video
            ))
        } catch (error) {
            console.error('Error adding comment:', error)
        }
    }

    // Handle scroll
    const handleScroll = (e) => {
        const container = e.target
        const scrollTop = container.scrollTop
        const videoHeight = window.innerHeight
        const newIndex = Math.round(scrollTop / videoHeight)

        if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
            setCurrentVideoIndex(newIndex)
        }
    }

    // Auto-play current video
    useEffect(() => {
        const allVideos = document.querySelectorAll('video')
        allVideos.forEach((video, index) => {
            if (index === currentVideoIndex) {
                video.currentTime = 0
                video.play().catch(() => { })
            } else {
                video.pause()
            }
        })
    }, [currentVideoIndex, videos])

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
                        border: '3px solid #ff6b6b',
                        borderTop: '3px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '1rem'
                    }}></div>
                    <p>Loading delicious videos...</p>
                </div>
            </div>
        )
    }

    if (error) {
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
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😞</div>
                <h2>Oops! Something went wrong</h2>
                <p style={{ opacity: 0.8 }}>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '12px 24px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div style={{ position: 'relative', height: '100vh', backgroundColor: '#000' }}>
            {/* Video Container */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                style={{
                    height: '100vh',
                    overflowY: 'scroll',
                    scrollSnapType: 'y mandatory',
                    scrollBehavior: 'smooth'
                }}
            >
                {videos.map((video, index) => (
                    <div
                        key={video.id}
                        style={{
                            height: '100vh',
                            width: '100vw',
                            position: 'relative',
                            scrollSnapAlign: 'start',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#000'
                        }}
                    >
                        {/* Video */}
                        <video
                            src={video.videoUrl}
                            muted
                            loop
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            onClick={(e) => {
                                if (e.target.paused) {
                                    e.target.play()
                                } else {
                                    e.target.pause()
                                }
                            }}
                        />

                        {/* Right Side Actions */}
                        <div style={{
                            position: 'absolute',
                            right: '15px',
                            bottom: '100px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            alignItems: 'center'
                        }}>
                            {/* Like Button */}
                            <div style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => handleLike(video.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '28px',
                                        cursor: 'pointer',
                                        color: likes[video.id] ? '#ff6b6b' : 'white',
                                        marginBottom: '5px'
                                    }}
                                >
                                    {likes[video.id] ? '❤️' : '🤍'}
                                </button>
                                <div style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {video.likeCount}
                                </div>
                            </div>

                            {/* Comment Button */}
                            <div style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => handleComment(video.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '28px',
                                        cursor: 'pointer',
                                        color: 'white',
                                        marginBottom: '5px'
                                    }}
                                >
                                    💬
                                </button>
                                <div style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {video.commentCount}
                                </div>
                            </div>

                            {/* Save Button */}
                            <div style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => handleSave(video.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '28px',
                                        cursor: 'pointer',
                                        color: saves[video.id] ? '#feca57' : 'white',
                                        marginBottom: '5px'
                                    }}
                                >
                                    {saves[video.id] ? '🔖' : '📑'}
                                </button>
                                <div style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {video.saveCount}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Info */}
                        <div style={{
                            position: 'absolute',
                            bottom: '100px',
                            left: '15px',
                            right: '80px',
                            color: 'white'
                        }}>
                            <h3 style={{
                                margin: '0 0 8px 0',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}>
                                @{video.restaurantName}
                            </h3>
                            <p style={{
                                margin: '0 0 15px 0',
                                fontSize: '14px',
                                lineHeight: '1.4'
                            }}>
                                {video.description}
                            </p>
                            <button
                                onClick={() => navigate(`/restaurant/${video.restaurantId}`)}
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '20px',
                                    padding: '8px 16px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                Visit Store
                            </button>
                        </div>
                    </div>
                ))}
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
                        color: 'white',
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
                            color: '#ff6b6b',
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

                {isLoggedIn ? (
                    <button
                        onClick={async () => {
                            try {
                                await axios.post('http://localhost:3000/api/auth/logout', {}, {
                                    withCredentials: true
                                })
                                setIsLoggedIn(false)
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
                ) : (
                    <button
                        onClick={() => navigate('/')}
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
                        🔑
                        <span style={{ fontSize: '10px' }}>Login</span>
                    </button>
                )}
            </div>

            {/* Comments Modal */}
            {showComments && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                    backgroundColor: '#1a1a1a',
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px',
                    zIndex: 2000,
                    padding: '20px',
                    color: 'white'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <h3>Comments</h3>
                        <button
                            onClick={() => setShowComments(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '24px',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Comment Input */}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '20px'
                    }}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '20px',
                                border: 'none',
                                backgroundColor: '#333',
                                color: 'white'
                            }}
                        />
                        <button
                            onClick={() => addComment(videos[currentVideoIndex]?.id)}
                            style={{
                                backgroundColor: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '10px 20px',
                                cursor: 'pointer'
                            }}
                        >
                            Send
                        </button>
                    </div>

                    {/* Comments List */}
                    <div style={{
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}>
                        {comments[videos[currentVideoIndex]?.id]?.map((comment) => (
                            <div key={comment._id} style={{
                                marginBottom: '15px',
                                padding: '10px',
                                backgroundColor: '#333',
                                borderRadius: '10px'
                            }}>
                                <div style={{
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                    fontSize: '14px'
                                }}>
                                    {comment.user.name}
                                </div>
                                <div style={{ fontSize: '14px' }}>
                                    {comment.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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

export default HomePage