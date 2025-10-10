import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const FoodRecognition = () => {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [recognitionResult, setRecognitionResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [suggestions, setSuggestions] = useState([])

    // Mock food recognition data
    const mockFoodDatabase = {
        'pizza': {
            name: 'Pizza',
            emoji: '🍕',
            confidence: 95,
            description: 'Delicious Italian flatbread with toppings',
            pairings: ['🥗 Caesar Salad', '🍷 Red Wine', '🧄 Garlic Bread'],
            nutrition: { calories: 285, protein: 12, carbs: 36, fat: 10 },
            similarVideos: [
                { id: '1', name: 'Margherita Pizza', restaurant: 'Italiano Bistro', thumbnail: '🍕' },
                { id: '2', name: 'Pepperoni Pizza', restaurant: 'Pizza Palace', thumbnail: '🍕' },
                { id: '3', name: 'Truffle Pizza', restaurant: 'Gourmet Kitchen', thumbnail: '🍕' }
            ]
        },
        'burger': {
            name: 'Burger',
            emoji: '🍔',
            confidence: 92,
            description: 'Classic American sandwich with meat patty',
            pairings: ['🍟 French Fries', '🥤 Cola', '🧅 Onion Rings'],
            nutrition: { calories: 540, protein: 25, carbs: 40, fat: 31 },
            similarVideos: [
                { id: '4', name: 'Beef Burger', restaurant: 'Burger Joint', thumbnail: '🍔' },
                { id: '5', name: 'Chicken Burger', restaurant: 'Grill House', thumbnail: '🍔' }
            ]
        },
        'sushi': {
            name: 'Sushi',
            emoji: '🍣',
            confidence: 88,
            description: 'Japanese dish with vinegared rice and fish',
            pairings: ['🍵 Green Tea', '🥢 Wasabi', '🥒 Pickled Ginger'],
            nutrition: { calories: 200, protein: 9, carbs: 37, fat: 1 },
            similarVideos: [
                { id: '6', name: 'Salmon Roll', restaurant: 'Sakura Sushi', thumbnail: '🍣' },
                { id: '7', name: 'Tuna Sashimi', restaurant: 'Tokyo Kitchen', thumbnail: '🍣' }
            ]
        }
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setSelectedImage(e.target.result)
                recognizeFood(file)
            }
            reader.readAsDataURL(file)
        }
    }

    const recognizeFood = async (file) => {
        setLoading(true)
        
        // Simulate AI processing delay
        setTimeout(() => {
            // Mock recognition - in real app, this would use AI/ML service
            const foodTypes = Object.keys(mockFoodDatabase)
            const randomFood = foodTypes[Math.floor(Math.random() * foodTypes.length)]
            const result = mockFoodDatabase[randomFood]
            
            setRecognitionResult(result)
            generateSuggestions(result)
            setLoading(false)
        }, 2000)
    }

    const generateSuggestions = (foodResult) => {
        const suggestions = [
            {
                type: 'pairing',
                title: 'Perfect Pairings',
                items: foodResult.pairings,
                icon: '🤝'
            },
            {
                type: 'nutrition',
                title: 'Nutrition Info',
                items: [
                    `🔥 ${foodResult.nutrition.calories} calories`,
                    `💪 ${foodResult.nutrition.protein}g protein`,
                    `🌾 ${foodResult.nutrition.carbs}g carbs`,
                    `🥑 ${foodResult.nutrition.fat}g fat`
                ],
                icon: '📊'
            },
            {
                type: 'tips',
                title: 'Pro Tips',
                items: [
                    '📸 Take photos in good lighting',
                    '🍽️ Try different angles',
                    '⭐ Rate your experience',
                    '📍 Tag the location'
                ],
                icon: '💡'
            }
        ]
        setSuggestions(suggestions)
    }

    const handleCameraCapture = () => {
        // In a real app, this would open camera
        alert('Camera feature coming soon! 📸')
    }

    const resetRecognition = () => {
        setSelectedImage(null)
        setRecognitionResult(null)
        setSuggestions([])
        setLoading(false)
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
                    <h1 style={{ margin: 0, fontSize: '24px' }}>🤖 AI Food Recognition</h1>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    Upload a photo to discover similar food videos and get smart suggestions!
                </p>
            </div>

            <div style={{ padding: '20px' }}>
                {!selectedImage ? (
                    /* Upload Section */
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '30px',
                        paddingTop: '60px'
                    }}>
                        {/* Upload Area */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                width: '280px',
                                height: '280px',
                                border: '3px dashed #ff6b6b',
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                backgroundColor: '#1a1a1a',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2a2a2a'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#1a1a1a'}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📸</div>
                            <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>
                                Upload Food Photo
                            </h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#666', textAlign: 'center' }}>
                                Tap to select from gallery
                            </p>
                        </div>

                        {/* Camera Button */}
                        <button
                            onClick={handleCameraCapture}
                            style={{
                                backgroundColor: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '15px 30px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            📷 Take Photo
                        </button>

                        {/* Features */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px',
                            width: '100%',
                            marginTop: '40px'
                        }}>
                            {[
                                {
                                    icon: '🔍',
                                    title: 'Smart Recognition',
                                    description: 'AI identifies your food with 90%+ accuracy'
                                },
                                {
                                    icon: '🎯',
                                    title: 'Similar Videos',
                                    description: 'Find videos of the same dish from restaurants'
                                },
                                {
                                    icon: '🤝',
                                    title: 'Perfect Pairings',
                                    description: 'Get suggestions for drinks and sides'
                                },
                                {
                                    icon: '📊',
                                    title: 'Nutrition Info',
                                    description: 'Instant calorie and macro information'
                                }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    style={{
                                        backgroundColor: '#1a1a1a',
                                        borderRadius: '15px',
                                        padding: '20px',
                                        textAlign: 'center'
                                    }}
                                >
                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                                        {feature.icon}
                                    </div>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                                        {feature.title}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                    </div>
                ) : (
                    /* Results Section */
                    <div>
                        {/* Image Preview */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '30px'
                        }}>
                            <div style={{
                                position: 'relative',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                maxWidth: '300px'
                            }}>
                                <img
                                    src={selectedImage}
                                    alt="Uploaded food"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block'
                                    }}
                                />
                                <button
                                    onClick={resetRecognition}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '30px',
                                        height: '30px',
                                        cursor: 'pointer',
                                        fontSize: '16px'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            /* Loading */
                            <div style={{
                                textAlign: 'center',
                                padding: '40px'
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    border: '3px solid #ff6b6b',
                                    borderTop: '3px solid transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    margin: '0 auto 20px'
                                }}></div>
                                <h3>🤖 AI is analyzing your food...</h3>
                                <p style={{ color: '#666' }}>This might take a few seconds</p>
                            </div>
                        ) : recognitionResult ? (
                            /* Recognition Results */
                            <div>
                                {/* Recognition Result */}
                                <div style={{
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '15px',
                                    padding: '20px',
                                    marginBottom: '30px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                                        {recognitionResult.emoji}
                                    </div>
                                    <h2 style={{ margin: '0 0 10px 0', color: '#ff6b6b' }}>
                                        {recognitionResult.name}
                                    </h2>
                                    <p style={{ margin: '0 0 15px 0', color: '#666' }}>
                                        {recognitionResult.description}
                                    </p>
                                    <div style={{
                                        backgroundColor: '#00ff88',
                                        color: '#000',
                                        padding: '5px 15px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        display: 'inline-block'
                                    }}>
                                        {recognitionResult.confidence}% confident
                                    </div>
                                </div>

                                {/* Similar Videos */}
                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        marginBottom: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        🎬 Similar Videos
                                    </h3>
                                    <div style={{
                                        display: 'flex',
                                        gap: '15px',
                                        overflowX: 'auto',
                                        paddingBottom: '10px'
                                    }}>
                                        {recognitionResult.similarVideos.map(video => (
                                            <div
                                                key={video.id}
                                                onClick={() => navigate(`/restaurant/${video.id}`)}
                                                style={{
                                                    minWidth: '120px',
                                                    backgroundColor: '#1a1a1a',
                                                    borderRadius: '10px',
                                                    padding: '15px',
                                                    cursor: 'pointer',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <div style={{
                                                    fontSize: '2rem',
                                                    marginBottom: '8px'
                                                }}>
                                                    {video.thumbnail}
                                                </div>
                                                <h4 style={{
                                                    margin: '0 0 4px 0',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {video.name}
                                                </h4>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '10px',
                                                    color: '#666'
                                                }}>
                                                    @{video.restaurant}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Suggestions */}
                                <div>
                                    <h3 style={{
                                        fontSize: '18px',
                                        marginBottom: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        ✨ Smart Suggestions
                                    </h3>
                                    <div style={{
                                        display: 'grid',
                                        gap: '15px'
                                    }}>
                                        {suggestions.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    backgroundColor: '#1a1a1a',
                                                    borderRadius: '12px',
                                                    padding: '15px'
                                                }}
                                            >
                                                <h4 style={{
                                                    margin: '0 0 10px 0',
                                                    fontSize: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}>
                                                    {suggestion.icon} {suggestion.title}
                                                </h4>
                                                <div style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '8px'
                                                }}>
                                                    {suggestion.items.map((item, itemIndex) => (
                                                        <span
                                                            key={itemIndex}
                                                            style={{
                                                                backgroundColor: '#333',
                                                                color: 'white',
                                                                padding: '4px 12px',
                                                                borderRadius: '15px',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : null}
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
                <button onClick={() => navigate('/ai-recognition')} style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    🤖<span style={{ fontSize: '10px' }}>AI</span>
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

export default FoodRecognition