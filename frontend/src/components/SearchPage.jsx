import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const SearchPage = () => {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [categories] = useState([
        { id: 'all', name: 'All', emoji: '🍽️' },
        { id: 'pizza', name: 'Pizza', emoji: '🍕' },
        { id: 'burger', name: 'Burgers', emoji: '🍔' },
        { id: 'sushi', name: 'Sushi', emoji: '🍣' },
        { id: 'pasta', name: 'Pasta', emoji: '🍝' },
        { id: 'dessert', name: 'Desserts', emoji: '🍰' },
        { id: 'chicken', name: 'Chicken', emoji: '🍗' },
        { id: 'indian', name: 'Indian', emoji: '🍛' },
        { id: 'healthy', name: 'Healthy', emoji: '🥗' },
        { id: 'spicy', name: 'Spicy', emoji: '🌶️' },
        { id: 'comfort', name: 'Comfort', emoji: '🍲' },
        { id: 'street', name: 'Street Food', emoji: '🌮' }
    ])
    const [aiSuggestions, setAiSuggestions] = useState([])
    const [searchHistory, setSearchHistory] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [loading, setLoading] = useState(false)
    const [trendingFoods, setTrendingFoods] = useState([])

    // Fetch trending foods and AI suggestions
    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/food/trending`)
                setTrendingFoods(response.data.data || [])
            } catch (error) {
                console.error('Error fetching trending:', error)
            }
        }
        
        const loadSearchHistory = () => {
            const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
            setSearchHistory(history.slice(0, 5)) // Keep last 5 searches
        }
        
        const generateAISuggestions = () => {
            const suggestions = [
                'Crispy fried chicken 🍗',
                'Cheesy pizza slice 🍕',
                'Fresh sushi rolls 🍣',
                'Spicy ramen bowl 🍜',
                'Chocolate dessert 🍫',
                'Healthy salad bowl 🥗',
                'Juicy burger 🍔',
                'Creamy pasta 🍝'
            ]
            setAiSuggestions(suggestions.sort(() => Math.random() - 0.5).slice(0, 4))
        }
        
        fetchTrending()
        loadSearchHistory()
        generateAISuggestions()
    }, [])

    // Search function with history tracking
    const handleSearch = async (query = searchQuery, category = selectedCategory) => {
        if (!query.trim() && category === 'all') {
            setSearchResults([])
            return
        }

        // Save to search history
        if (query.trim()) {
            const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
            const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 5)
            localStorage.setItem('searchHistory', JSON.stringify(newHistory))
            setSearchHistory(newHistory)
        }

        try {
            setLoading(true)
            const response = await axios.get(`${API_BASE_URL}/api/food/search`, {
                params: { q: query, category: category !== 'all' ? category : '' }
            })
            setSearchResults(response.data.data || [])
            setShowSuggestions(false)
        } catch (error) {
            console.error('Search error:', error)
            setSearchResults([])
        } finally {
            setLoading(false)
        }
    }

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        const cleanSuggestion = suggestion.replace(/[^\w\s]/gi, '').trim()
        setSearchQuery(cleanSuggestion)
        handleSearch(cleanSuggestion)
    }

    // Handle category selection
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId)
        handleSearch(searchQuery, categoryId)
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
                    marginBottom: '15px'
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
                    <h1 style={{ margin: 0, fontSize: '24px' }}>🔍 Discover Food</h1>
                </div>

                {/* Search Bar */}
                <div style={{
                    position: 'relative',
                    marginBottom: '15px'
                }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search for food, restaurants..."
                        style={{
                            width: '100%',
                            padding: '12px 50px 12px 20px',
                            borderRadius: '25px',
                            border: 'none',
                            backgroundColor: '#1a1a1a',
                            color: 'white',
                            fontSize: '16px'
                        }}
                    />
                    
                    {/* Search Suggestions Dropdown */}
                    {showSuggestions && (searchHistory.length > 0 || aiSuggestions.length > 0) && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: '#1a1a1a',
                            borderRadius: '15px',
                            marginTop: '5px',
                            padding: '10px',
                            zIndex: 200,
                            border: '1px solid #333'
                        }}>
                            {searchHistory.length > 0 && (
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                                        🕒 Recent Searches
                                    </div>
                                    {searchHistory.map((item, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSuggestionClick(item)}
                                            style={{
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                marginBottom: '4px'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {aiSuggestions.length > 0 && (
                                <div>
                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                                        🤖 AI Suggestions
                                    </div>
                                    {aiSuggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            style={{
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                marginBottom: '4px'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            {suggestion}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <button
                        onClick={() => handleSearch()}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#ff6b6b',
                            fontSize: '20px',
                            cursor: 'pointer'
                        }}
                    >
                        🔍
                    </button>
                </div>

                {/* Categories */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    overflowX: 'auto',
                    paddingBottom: '5px'
                }}>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => handleCategorySelect(category.id)}
                            style={{
                                background: selectedCategory === category.id ? '#ff6b6b' : '#1a1a1a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <span>{category.emoji}</span>
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '20px' }}>
                {/* Fun Features Section */}
                {!searchQuery && selectedCategory === 'all' && (
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ 
                            fontSize: '20px', 
                            marginBottom: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            🎪 Fun Features
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '15px',
                            marginBottom: '30px'
                        }}>
                            <div
                                onClick={() => navigate('/ai-recognition')}
                                style={{
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '15px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid transparent',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.borderColor = '#ff6b6b'}
                                onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🤖</div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>AI Recognition</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Upload food photos</p>
                            </div>
                            
                            <div
                                onClick={() => navigate('/trivia')}
                                style={{
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '15px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid transparent',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.borderColor = '#feca57'}
                                onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🧠</div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Food Trivia</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Test your knowledge</p>
                            </div>
                            
                            <div
                                onClick={() => navigate('/trending')}
                                style={{
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '15px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid transparent',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.borderColor = '#00ff88'}
                                onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔥</div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Trending</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>What's hot now</p>
                            </div>
                            
                            <div
                                onClick={() => navigate('/challenges')}
                                style={{
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '15px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid transparent',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.borderColor = '#feca57'}
                                onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏆</div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Challenges</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Earn badges</p>
                            </div>
                            
                            <div
                                onClick={() => navigate('/live')}
                                style={{
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '15px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid transparent',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.borderColor = '#ff0000'}
                                onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔴</div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Live Cooking</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Watch chefs live</p>
                            </div>
                            
                            <div
                                onClick={() => navigate('/delivery')}
                                style={{
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '15px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid transparent',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.borderColor = '#74b9ff'}
                                onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚚</div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Delivery</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Order food now</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Trending Section */}
                {!searchQuery && selectedCategory === 'all' && trendingFoods.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ 
                            fontSize: '20px', 
                            marginBottom: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            🔥 Trending Now
                        </h2>
                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            overflowX: 'auto',
                            paddingBottom: '10px'
                        }}>
                            {trendingFoods.slice(0, 5).map(food => (
                                <div
                                    key={food.id}
                                    onClick={() => navigate(`/restaurant/${food.restaurantId}`)}
                                    style={{
                                        minWidth: '120px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <video
                                        src={food.videoUrl}
                                        style={{
                                            width: '120px',
                                            height: '160px',
                                            objectFit: 'cover',
                                            borderRadius: '10px'
                                        }}
                                        muted
                                        onMouseEnter={(e) => e.target.play()}
                                        onMouseLeave={(e) => e.target.pause()}
                                    />
                                    <p style={{
                                        fontSize: '12px',
                                        margin: '5px 0',
                                        textAlign: 'center'
                                    }}>
                                        {food.foodName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search Results */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '3px solid #ff6b6b',
                            borderTop: '3px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 15px'
                        }}></div>
                        <p>Searching...</p>
                    </div>
                )}

                {searchResults.length > 0 && (
                    <div>
                        <h3 style={{ marginBottom: '15px' }}>
                            Search Results ({searchResults.length})
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: '15px'
                        }}>
                            {searchResults.map(food => (
                                <div
                                    key={food.id}
                                    onClick={() => navigate(`/restaurant/${food.restaurantId}`)}
                                    style={{
                                        backgroundColor: '#1a1a1a',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <video
                                        src={food.videoUrl}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover'
                                        }}
                                        muted
                                        onMouseEnter={(e) => e.target.play()}
                                        onMouseLeave={(e) => e.target.pause()}
                                    />
                                    <div style={{ padding: '12px' }}>
                                        <h4 style={{
                                            margin: '0 0 5px 0',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}>
                                            {food.foodName}
                                        </h4>
                                        <p style={{
                                            margin: '0 0 8px 0',
                                            fontSize: '12px',
                                            color: '#999'
                                        }}>
                                            @{food.restaurantName}
                                        </p>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '11px',
                                            color: '#666'
                                        }}>
                                            <span>❤️ {food.likeCount}</span>
                                            <span>💬 {food.commentCount}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results */}
                {!loading && searchQuery && searchResults.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: '#666'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
                        <h3 style={{ marginBottom: '10px', color: 'white' }}>No Results Found</h3>
                        <p>Try searching for something else or browse categories above</p>
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
                <button onClick={() => navigate('/search')} style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    🔍<span style={{ fontSize: '10px' }}>Search</span>
                </button>
                <button onClick={() => navigate('/saved')} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    🔖<span style={{ fontSize: '10px' }}>Saved</span>
                </button>
                <button onClick={() => navigate('/trending')} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
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

export default SearchPage