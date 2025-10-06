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

    // Fetch food items from backend
    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                setLoading(true)
                const response = await axios.get('http://localhost:3000/api/food')

                console.log('Food items response:', response.data)

                // Transform backend data to match our video format
                const transformedVideos = response.data.data.map((item, index) => {
                    console.log('Processing item:', item)
                    console.log('Food Partner:', item.foodPartner)

                    return {
                        id: item._id,
                        videoUrl: item.video,
                        description: item.description,
                        restaurantName: item.foodPartner?.restaurantName || 'Unknown Restaurant',
                        restaurantId: item.foodPartner?._id || item.foodPartner,
                        foodName: item.name,
                        createdAt: item.createdAt
                    }
                })

                setVideos(transformedVideos)
                setError('')
            } catch (error) {
                console.error('Error fetching food items:', error)
                setError('Failed to load food videos. Please try again.')
                // Fallback to empty array
                setVideos([])
            } finally {
                setLoading(false)
            }
        }

        fetchFoodItems()
    }, [])



    // Truncate description to 2 lines (approximately 120 characters)
    const truncateDescription = (text, maxLength = 120) => {
        if (text.length <= maxLength) return text
        return text.substr(0, maxLength) + '...'
    }

    // Handle scroll with snapping
    const handleScroll = (e) => {
        const container = e.target
        const scrollTop = container.scrollTop
        const videoHeight = window.innerHeight
        const newIndex = Math.round(scrollTop / videoHeight)

        if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
            setCurrentVideoIndex(newIndex)
        }
    }

    // Snap to video on scroll end
    useEffect(() => {
        let scrollTimeout
        const container = containerRef.current

        if (container) {
            const handleScrollEnd = () => {
                clearTimeout(scrollTimeout)
                scrollTimeout = setTimeout(() => {
                    const videoHeight = window.innerHeight
                    const targetScrollTop = currentVideoIndex * videoHeight
                    container.scrollTo({
                        top: targetScrollTop,
                        behavior: 'smooth'
                    })
                }, 150)
            }

            container.addEventListener('scroll', handleScrollEnd)
            return () => {
                container.removeEventListener('scroll', handleScrollEnd)
                clearTimeout(scrollTimeout)
            }
        }
    }, [currentVideoIndex])

    // Handle video playback when current video changes
    useEffect(() => {
        const allVideos = document.querySelectorAll('video')
        allVideos.forEach((video, index) => {
            const playButton = video.parentElement?.querySelector('.play-button-overlay')

            if (index === currentVideoIndex) {
                // Play current video
                video.currentTime = 0
                video.play().then(() => {
                    // Hide play button if video plays successfully
                    if (playButton) {
                        playButton.style.display = 'none'
                    }
                }).catch(error => {
                    console.error('Autoplay failed for video:', error)
                    // Show play button if autoplay fails
                    if (playButton) {
                        playButton.style.display = 'flex'
                    }
                })
            } else {
                // Pause other videos and hide their play buttons
                video.pause()
                if (playButton) {
                    playButton.style.display = 'none'
                }
            }
        })
    }, [currentVideoIndex, videos])

    // Add intersection observer to handle video visibility
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video')
                const playButton = entry.target.querySelector('.play-button-overlay')

                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    // Video is mostly visible, try to play
                    if (video && video.paused) {
                        video.play().catch(() => {
                            // Show play button if autoplay fails
                            if (playButton) {
                                playButton.style.display = 'flex'
                            }
                        })
                    }
                } else {
                    // Video is not visible, pause it
                    if (video && !video.paused) {
                        video.pause()
                    }
                    if (playButton) {
                        playButton.style.display = 'none'
                    }
                }
            })
        }, { threshold: 0.5 })

        // Observe all video containers
        const videoContainers = document.querySelectorAll('.video-item')
        videoContainers.forEach(container => observer.observe(container))

        return () => observer.disconnect()
    }, [videos])

    useEffect(() => {
        axios.get("http://localhost:3000/api/food")
            .then((res) => {
                videos(res.data.fooditems)
            })
            .catch((err) => {
                console.log(err)
            })
    })
    // Loading state
    if (loading) {
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
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '3px solid #ff6b6b',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '1rem'
                }}></div>
                <p style={{ fontSize: '18px' }}>Loading delicious food videos...</p>
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

    // Error state
    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#000',
                color: 'white',
                flexDirection: 'column',
                padding: '2rem'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😞</div>
                <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Oops! Something went wrong</h2>
                <p style={{ marginBottom: '2rem', textAlign: 'center', opacity: 0.8 }}>{error}</p>
                <button
                    onClick={() => window.location.reload()}
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
                    Try Again
                </button>
            </div>
        )
    }

    // No videos state
    if (videos.length === 0) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#000',
                color: 'white',
                flexDirection: 'column',
                padding: '2rem'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
                <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>No Food Videos Yet</h2>
                <p style={{ marginBottom: '2rem', textAlign: 'center', opacity: 0.8 }}>
                    Be the first to share your delicious creations!
                </p>
                <button
                    onClick={() => navigate('/food-partner/register')}
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
                    Become a Food Partner
                </button>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="reels-container"
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
                    className="video-item"
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
                    {/* Video Element */}
                    <video
                        key={video.id}
                        src={video.videoUrl}
                        autoPlay={index === currentVideoIndex}
                        muted
                        loop
                        playsInline
                        controls={false}
                        preload="metadata"
                        crossOrigin="anonymous"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                        onError={(e) => {
                            console.error('Video error for:', video.videoUrl, e)
                            console.error('Error details:', e.target.error)
                            // Show error overlay
                            e.target.style.display = 'none'
                            const errorDiv = e.target.parentElement.querySelector('.video-error')
                            if (errorDiv) {
                                errorDiv.style.display = 'flex'
                            }
                        }}
                        onLoadStart={() => {
                            console.log('Video loading started:', video.videoUrl)
                        }}
                        onCanPlay={() => {
                            console.log('Video can play:', video.videoUrl)
                        }}
                        onLoadedData={() => {
                            console.log('Video loaded:', video.videoUrl)
                        }}
                        onClick={(e) => {
                            // Toggle play/pause on click
                            if (e.target.paused) {
                                e.target.play()
                            } else {
                                e.target.pause()
                            }
                        }}
                    />

                    {/* Play Button Overlay (for videos that can't autoplay) */}
                    <div
                        className="play-button-overlay"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            borderRadius: '50%',
                            width: '80px',
                            height: '80px',
                            display: 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            zIndex: 5
                        }}
                        onClick={(e) => {
                            const video = e.target.parentElement.querySelector('video')
                            if (video) {
                                video.play().then(() => {
                                    e.target.style.display = 'none'
                                }).catch(error => {
                                    console.error('Manual play failed:', error)
                                })
                            }
                        }}
                    >
                        <div style={{
                            fontSize: '2rem',
                            color: 'white',
                            marginLeft: '4px' // Slight offset for play triangle
                        }}>
                            ▶️
                        </div>
                    </div>

                    {/* Video Error Fallback */}
                    <div
                        className="video-error"
                        style={{
                            display: 'none',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#1a1a1a',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            color: 'white',
                            zIndex: 1
                        }}
                    >
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📹</div>
                        <h3 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Video Unavailable</h3>
                        <p style={{ textAlign: 'center', opacity: 0.7, fontSize: '14px' }}>
                            This video cannot be played
                        </p>
                        <button
                            onClick={() => {
                                // Try to reload the video
                                const videoElement = document.querySelector(`video[src="${video.videoUrl}"]`)
                                if (videoElement) {
                                    videoElement.load()
                                    videoElement.style.display = 'block'
                                    document.querySelector('.video-error').style.display = 'none'
                                }
                            }}
                            style={{
                                marginTop: '1rem',
                                backgroundColor: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            Try Again
                        </button>
                    </div>

                    {/* Overlay Content */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '20px',
                            right: '20px',
                            zIndex: 10
                        }}
                    >
                        {/* Description */}
                        <p
                            style={{
                                color: 'white',
                                fontSize: '16px',
                                lineHeight: '1.4',
                                marginBottom: '15px',
                                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                maxHeight: '2.8em'
                            }}
                        >
                            {truncateDescription(video.description)}
                        </p>

                        {/* Visit Store Button */}
                        <button
                            onClick={() => {
                                // Navigate to restaurant store
                                console.log(`Visiting ${video.restaurantName} store`)
                                navigate(`/restaurant/${video.restaurantId}`)
                            }}
                            style={{
                                backgroundColor: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '12px 24px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#ff5252'
                                e.target.style.transform = 'translateY(-2px)'
                                e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 107, 0.6)'
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#ff6b6b'
                                e.target.style.transform = 'translateY(0)'
                                e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)'
                            }}
                        >
                            <span>🏪</span>
                            Visit Store
                        </button>
                    </div>

                    {/* Restaurant Name Badge */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {video.restaurantName}
                    </div>

                    {/* Video Counter */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '15px',
                            fontSize: '12px',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {index + 1} / {videos.length}
                    </div>
                </div>
            ))}

            {/* Scroll Indicator */}
            <div
                style={{
                    position: 'fixed',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}
            >
                {videos.map((_, index) => (
                    <div
                        key={index}
                        style={{
                            width: '4px',
                            height: '20px',
                            backgroundColor: index === currentVideoIndex ? '#ff6b6b' : 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '2px',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default HomePage