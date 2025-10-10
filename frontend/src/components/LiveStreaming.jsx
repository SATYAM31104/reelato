import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LiveStreaming = () => {
    const navigate = useNavigate()
    const [liveStreams, setLiveStreams] = useState([])
    const [selectedStream, setSelectedStream] = useState(null)
    const [viewerCount, setViewerCount] = useState(0)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(true)

    const mockLiveStreams = [
        {
            id: 'live-1',
            title: '🍕 Making Authentic Neapolitan Pizza',
            restaurantName: 'Italiano Bistro',
            chefName: 'Chef Marco',
            viewers: 1247,
            duration: '45:32',
            thumbnail: '🍕',
            category: 'Italian',
            isLive: true,
            startedAt: '2 hours ago'
        },
        {
            id: 'live-2',
            title: '🍜 Ramen Masterclass - From Broth to Bowl',
            restaurantName: 'Tokyo Ramen House',
            chefName: 'Chef Tanaka',
            viewers: 892,
            duration: '1:12:45',
            thumbnail: '🍜',
            category: 'Japanese',
            isLive: true,
            startedAt: '1 hour ago'
        },
        {
            id: 'live-3',
            title: '🥘 Indian Curry Secrets Revealed',
            restaurantName: 'Spice Garden',
            chefName: 'Chef Priya',
            viewers: 634,
            duration: '28:15',
            thumbnail: '🥘',
            category: 'Indian',
            isLive: true,
            startedAt: '30 minutes ago'
        },
        {
            id: 'live-4',
            title: '🍰 Dessert Decoration Workshop',
            restaurantName: 'Sweet Dreams Bakery',
            chefName: 'Chef Sarah',
            viewers: 445,
            duration: '15:22',
            thumbnail: '🍰',
            category: 'Desserts',
            isLive: true,
            startedAt: '15 minutes ago'
        }
    ]

    const mockComments = [
        { id: 1, user: 'FoodLover23', message: 'This looks amazing! 🤤', time: '2m ago' },
        { id: 2, user: 'ChefInTraining', message: 'What temperature for the oven?', time: '1m ago' },
        { id: 3, user: 'PizzaFan', message: 'Can you show the dough technique again?', time: '30s ago' },
        { id: 4, user: 'Foodie_Explorer', message: 'Following from NYC! 🗽', time: '15s ago' }
    ]

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLiveStreams(mockLiveStreams)
            setLoading(false)
        }, 1000)

        // Simulate real-time viewer count updates
        const interval = setInterval(() => {
            if (selectedStream) {
                setViewerCount(prev => prev + Math.floor(Math.random() * 10) - 5)
            }
        }, 3000)

        return () => clearInterval(interval)
    }, [selectedStream])

    const joinStream = (stream) => {
        setSelectedStream(stream)
        setViewerCount(stream.viewers)
        setComments(mockComments)
    }

    const sendComment = () => {
        if (!newComment.trim()) return

        const comment = {
            id: Date.now(),
            user: 'You',
            message: newComment,
            time: 'now'
        }

        setComments(prev => [...prev, comment])
        setNewComment('')
    }

    const formatViewers = (count) => {
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
        return count.toString()
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
                        border: '3px solid #ff6b6b',
                        borderTop: '3px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '1rem'
                    }}></div>
                    <p>Loading live streams...</p>
                </div>
            </div>
        )
    }

    if (selectedStream) {
        return (
            <div style={{ 
                backgroundColor: '#000', 
                height: '100vh', 
                color: 'white',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Stream Header */}
                <div style={{
                    padding: '15px 20px',
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <button
                        onClick={() => setSelectedStream(null)}
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
                    
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                            {selectedStream.title}
                        </h3>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '15px',
                            fontSize: '12px',
                            color: '#666'
                        }}>
                            <span style={{
                                backgroundColor: '#ff0000',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontSize: '10px',
                                fontWeight: 'bold'
                            }}>
                                🔴 LIVE
                            </span>
                            <span>👥 {formatViewers(viewerCount)}</span>
                            <span>⏱️ {selectedStream.duration}</span>
                        </div>
                    </div>

                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '20px',
                            cursor: 'pointer'
                        }}
                    >
                        ⋮
                    </button>
                </div>

                {/* Video Stream Area */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <div style={{
                        fontSize: '8rem',
                        opacity: 0.3
                    }}>
                        {selectedStream.thumbnail}
                    </div>
                    
                    {/* Live Stream Overlay */}
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        borderRadius: '10px',
                        padding: '10px 15px'
                    }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                            {selectedStream.chefName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                            @{selectedStream.restaurantName}
                        </div>
                    </div>

                    {/* Reaction Buttons */}
                    <div style={{
                        position: 'absolute',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        {['❤️', '👏', '🔥', '😍', '🤤'].map(emoji => (
                            <button
                                key={emoji}
                                style={{
                                    background: 'rgba(0,0,0,0.7)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    color: 'white'
                                }}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comments Section */}
                <div style={{
                    height: '200px',
                    borderTop: '1px solid #333',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Comments List */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '15px'
                    }}>
                        {comments.map(comment => (
                            <div
                                key={comment.id}
                                style={{
                                    marginBottom: '12px',
                                    fontSize: '14px'
                                }}
                            >
                                <span style={{ 
                                    fontWeight: 'bold', 
                                    color: '#ff6b6b',
                                    marginRight: '8px'
                                }}>
                                    {comment.user}
                                </span>
                                <span style={{ marginRight: '8px' }}>
                                    {comment.message}
                                </span>
                                <span style={{ 
                                    fontSize: '12px', 
                                    color: '#666' 
                                }}>
                                    {comment.time}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Comment Input */}
                    <div style={{
                        padding: '15px',
                        borderTop: '1px solid #333',
                        display: 'flex',
                        gap: '10px'
                    }}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendComment()}
                            placeholder="Say something nice..."
                            style={{
                                flex: 1,
                                padding: '10px 15px',
                                borderRadius: '20px',
                                border: 'none',
                                backgroundColor: '#1a1a1a',
                                color: 'white',
                                fontSize: '14px'
                            }}
                        />
                        <button
                            onClick={sendComment}
                            style={{
                                backgroundColor: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '10px 20px',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            Send
                        </button>
                    </div>
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
                    gap: '15px',
                    marginBottom: '10px'
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
                    <h1 style={{ margin: 0, fontSize: '24px' }}>🔴 Live Cooking</h1>
                    <div style={{
                        backgroundColor: '#ff0000',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                        {liveStreams.length} LIVE
                    </div>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    Watch chefs cook live and learn their secrets!
                </p>
            </div>

            <div style={{ padding: '20px' }}>
                {/* Live Streams Grid */}
                <div style={{
                    display: 'grid',
                    gap: '20px'
                }}>
                    {liveStreams.map(stream => (
                        <div
                            key={stream.id}
                            onClick={() => joinStream(stream)}
                            style={{
                                backgroundColor: '#1a1a1a',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: '2px solid transparent',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.borderColor = '#ff6b6b'}
                            onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
                        >
                            {/* Stream Thumbnail */}
                            <div style={{
                                height: '200px',
                                backgroundColor: '#333',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <div style={{ fontSize: '4rem', opacity: 0.7 }}>
                                    {stream.thumbnail}
                                </div>
                                
                                {/* Live Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '15px',
                                    left: '15px',
                                    backgroundColor: '#ff0000',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '15px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}>
                                    🔴 LIVE
                                </div>

                                {/* Viewer Count */}
                                <div style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '10px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    👥 {formatViewers(stream.viewers)}
                                </div>

                                {/* Duration */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '15px',
                                    right: '15px',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '10px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {stream.duration}
                                </div>
                            </div>

                            {/* Stream Info */}
                            <div style={{ padding: '15px' }}>
                                <h3 style={{
                                    margin: '0 0 8px 0',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}>
                                    {stream.title}
                                </h3>
                                
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{ fontSize: '14px', color: '#ff6b6b' }}>
                                        {stream.chefName}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#666' }}>
                                        @{stream.restaurantName}
                                    </span>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '12px',
                                    color: '#666'
                                }}>
                                    <span style={{
                                        backgroundColor: '#333',
                                        padding: '2px 8px',
                                        borderRadius: '10px'
                                    }}>
                                        {stream.category}
                                    </span>
                                    <span>Started {stream.startedAt}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coming Soon Section */}
                <div style={{
                    marginTop: '40px',
                    textAlign: 'center',
                    padding: '40px 20px',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '15px'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📅</div>
                    <h3 style={{ marginBottom: '10px' }}>More Live Streams Coming Soon!</h3>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                        Follow your favorite restaurants to get notified when they go live
                    </p>
                    <button
                        onClick={() => navigate('/search')}
                        style={{
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        Discover Restaurants
                    </button>
                </div>
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
                <button onClick={() => navigate('/feed')} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    🏠<span style={{ fontSize: '10px' }}>Home</span>
                </button>
                <button onClick={() => navigate('/search')} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    🔍<span style={{ fontSize: '10px' }}>Search</span>
                </button>
                <button onClick={() => navigate('/live')} style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    🔴<span style={{ fontSize: '10px' }}>Live</span>
                </button>
                <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    👤<span style={{ fontSize: '10px' }}>Profile</span>
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

export default LiveStreaming