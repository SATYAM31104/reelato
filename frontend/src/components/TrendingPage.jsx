import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const TrendingPage = () => {
    const navigate = useNavigate()
    const [trendingVideos, setTrendingVideos] = useState([])
    const [trendingRestaurants, setTrendingRestaurants] = useState([])
    const [hotCategories, setHotCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('videos') // videos, restaurants, categories
    const [timeFilter, setTimeFilter] = useState('today') // today, week, month

    useEffect(() => {
        fetchTrendingData()
    }, [timeFilter])

    const fetchTrendingData = async () => {
        try {
            setLoading(true)
            
            // Mock trending data - in real app, this would come from backend analytics
            const mockTrendingVideos = [
                {
                    id: '1',
                    foodName: 'Spicy Korean Ramen',
                    restaurantName: 'Seoul Kitchen',
                    videoUrl: '/videos/ramen.mp4',
                    views: 15420,
                    likes: 2340,
                    growth: '+45%',
                    emoji: '🍜'
                },
                {
                    id: '2',
                    foodName: 'Truffle Pizza',
                    restaurantName: 'Italiano Bistro',
                    videoUrl: '/videos/pizza.mp4',
                    views: 12890,
                    likes: 1890,
                    growth: '+38%',
                    emoji: '🍕'
                },
                {
                    id: '3',
                    foodName: 'Rainbow Sushi Roll',
                    restaurantName: 'Sakura Sushi',
                    videoUrl: '/videos/sushi.mp4',
                    views: 11200,
                    likes: 1650,
                    growth: '+32%',
                    emoji: '🍣'
                }
            ]

            const mockTrendingRestaurants = [
                {
                    id: '1',
                    name: 'Seoul Kitchen',
                    followers: 8420,
                    totalViews: 45600,
                    growth: '+52%',
                    avatar: '🏪',
                    specialty: 'Korean Cuisine'
                },
                {
                    id: '2',
                    name: 'Italiano Bistro',
                    followers: 6890,
                    totalViews: 38900,
                    growth: '+41%',
                    avatar: '🍝',
                    specialty: 'Italian Food'
                }
            ]

            const mockHotCategories = [
                { name: 'Spicy Food', emoji: '🌶️', growth: '+67%', posts: 234 },
                { name: 'Desserts', emoji: '🍰', growth: '+45%', posts: 189 },
                { name: 'Street Food', emoji: '🌮', growth: '+38%', posts: 156 },
                { name: 'Healthy', emoji: '🥗', growth: '+29%', posts: 143 }
            ]

            setTrendingVideos(mockTrendingVideos)
            setTrendingRestaurants(mockTrendingRestaurants)
            setHotCategories(mockHotCategories)
        } catch (error) {
            console.error('Error fetching trending data:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
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
                    <p>Loading trending content...</p>
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
                    marginBottom: '20px'
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
                    <h1 style={{ margin: 0, fontSize: '24px' }}>🔥 Trending</h1>
                </div>

                {/* Time Filter */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '15px'
                }}>
                    {['today', 'week', 'month'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setTimeFilter(filter)}
                            style={{
                                background: timeFilter === filter ? '#ff6b6b' : '#1a1a1a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '15px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '5px'
                }}>
                    {[
                        { id: 'videos', name: 'Videos', emoji: '📹' },
                        { id: 'restaurants', name: 'Restaurants', emoji: '🏪' },
                        { id: 'categories', name: 'Categories', emoji: '📊' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                background: activeTab === tab.id ? '#ff6b6b' : 'transparent',
                                color: 'white',
                                border: activeTab === tab.id ? 'none' : '1px solid #333',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <span>{tab.emoji}</span>
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '20px' }}>
                {/* Trending Videos */}
                {activeTab === 'videos' && (
                    <div>
                        <h2 style={{ 
                            fontSize: '18px', 
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            📹 Trending Videos
                        </h2>
                        
                        {trendingVideos.map((video, index) => (
                            <div
                                key={video.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    marginBottom: '12px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(`/restaurant/${video.id}`)}
                            >
                                {/* Rank */}
                                <div style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#666',
                                    minWidth: '30px'
                                }}>
                                    #{index + 1}
                                </div>

                                {/* Video Thumbnail */}
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: '#333',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px'
                                }}>
                                    {video.emoji}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <h4 style={{
                                        margin: '0 0 4px 0',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}>
                                        {video.foodName}
                                    </h4>
                                    <p style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '14px',
                                        color: '#999'
                                    }}>
                                        @{video.restaurantName}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        gap: '15px',
                                        fontSize: '12px',
                                        color: '#666'
                                    }}>
                                        <span>👁️ {formatNumber(video.views)}</span>
                                        <span>❤️ {formatNumber(video.likes)}</span>
                                    </div>
                                </div>

                                {/* Growth */}
                                <div style={{
                                    backgroundColor: '#00ff88',
                                    color: '#000',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {video.growth}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Trending Restaurants */}
                {activeTab === 'restaurants' && (
                    <div>
                        <h2 style={{ 
                            fontSize: '18px', 
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            🏪 Trending Restaurants
                        </h2>
                        
                        {trendingRestaurants.map((restaurant, index) => (
                            <div
                                key={restaurant.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    marginBottom: '12px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                            >
                                {/* Rank */}
                                <div style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                                    minWidth: '30px'
                                }}>
                                    #{index + 1}
                                </div>

                                {/* Avatar */}
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: '#333',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px'
                                }}>
                                    {restaurant.avatar}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <h4 style={{
                                        margin: '0 0 4px 0',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}>
                                        {restaurant.name}
                                    </h4>
                                    <p style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '14px',
                                        color: '#999'
                                    }}>
                                        {restaurant.specialty}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        gap: '15px',
                                        fontSize: '12px',
                                        color: '#666'
                                    }}>
                                        <span>👥 {formatNumber(restaurant.followers)}</span>
                                        <span>👁️ {formatNumber(restaurant.totalViews)}</span>
                                    </div>
                                </div>

                                {/* Growth */}
                                <div style={{
                                    backgroundColor: '#00ff88',
                                    color: '#000',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {restaurant.growth}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Hot Categories */}
                {activeTab === 'categories' && (
                    <div>
                        <h2 style={{ 
                            fontSize: '18px', 
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            📊 Hot Categories
                        </h2>
                        
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '15px'
                        }}>
                            {hotCategories.map((category, index) => (
                                <div
                                    key={category.name}
                                    style={{
                                        backgroundColor: '#1a1a1a',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        cursor: 'pointer',
                                        border: index === 0 ? '2px solid #ff6b6b' : 'none'
                                    }}
                                    onClick={() => navigate(`/search?category=${category.name.toLowerCase()}`)}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '15px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}>
                                            <span style={{ fontSize: '24px' }}>{category.emoji}</span>
                                            <h3 style={{ margin: 0, fontSize: '18px' }}>{category.name}</h3>
                                        </div>
                                        <div style={{
                                            backgroundColor: '#00ff88',
                                            color: '#000',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {category.growth}
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#666'
                                    }}>
                                        {category.posts} new posts this {timeFilter}
                                    </div>
                                </div>
                            ))}
                        </div>
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
                <button onClick={() => navigate('/feed')} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    🏠<span style={{ fontSize: '10px' }}>Home</span>
                </button>
                <button onClick={() => navigate('/search')} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    🔍<span style={{ fontSize: '10px' }}>Search</span>
                </button>
                <button onClick={() => navigate('/saved')} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    🔖<span style={{ fontSize: '10px' }}>Saved</span>
                </button>
                <button onClick={() => navigate('/trending')} style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    🔥<span style={{ fontSize: '10px' }}>Trending</span>
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

export default TrendingPage