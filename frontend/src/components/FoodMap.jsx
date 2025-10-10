import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FoodMap = () => {
    const navigate = useNavigate()
    const [nearbyRestaurants, setNearbyRestaurants] = useState([])
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)
    const [mapView, setMapView] = useState('list') // list, map
    const [filterCategory, setFilterCategory] = useState('all')
    const [loading, setLoading] = useState(true)
    const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.0060, name: 'New York, NY' })

    const categories = [
        { id: 'all', name: 'All', emoji: '🍽️' },
        { id: 'pizza', name: 'Pizza', emoji: '🍕' },
        { id: 'asian', name: 'Asian', emoji: '🍜' },
        { id: 'burgers', name: 'Burgers', emoji: '🍔' },
        { id: 'desserts', name: 'Desserts', emoji: '🍰' },
        { id: 'coffee', name: 'Coffee', emoji: '☕' }
    ]

    const mockRestaurants = [
        {
            id: 'map-rest-1',
            name: 'Italiano Bistro',
            category: 'pizza',
            rating: 4.8,
            distance: '0.3 mi',
            address: '123 Main St, New York, NY',
            phone: '(555) 123-4567',
            hours: 'Open until 10 PM',
            priceRange: '$$',
            image: '🍕',
            coordinates: { lat: 40.7130, lng: -74.0065 },
            specialties: ['Margherita Pizza', 'Truffle Pasta', 'Tiramisu'],
            reviews: 1247,
            isOpen: true,
            deliveryTime: '25-35 min',
            featured: true
        },
        {
            id: 'map-rest-2',
            name: 'Tokyo Ramen House',
            category: 'asian',
            rating: 4.6,
            distance: '0.5 mi',
            address: '456 Broadway, New York, NY',
            phone: '(555) 234-5678',
            hours: 'Open until 11 PM',
            priceRange: '$',
            image: '🍜',
            coordinates: { lat: 40.7125, lng: -74.0070 },
            specialties: ['Tonkotsu Ramen', 'Gyoza', 'Miso Soup'],
            reviews: 892,
            isOpen: true,
            deliveryTime: '30-40 min',
            featured: false
        },
        {
            id: 'map-rest-3',
            name: 'Burger Palace',
            category: 'burgers',
            rating: 4.4,
            distance: '0.7 mi',
            address: '789 5th Ave, New York, NY',
            phone: '(555) 345-6789',
            hours: 'Open 24 hours',
            priceRange: '$',
            image: '🍔',
            coordinates: { lat: 40.7135, lng: -74.0055 },
            specialties: ['Classic Burger', 'Loaded Fries', 'Milkshakes'],
            reviews: 634,
            isOpen: true,
            deliveryTime: '20-30 min',
            featured: false
        },
        {
            id: 'map-rest-4',
            name: 'Sweet Dreams Bakery',
            category: 'desserts',
            rating: 4.9,
            distance: '0.4 mi',
            address: '321 Park Ave, New York, NY',
            phone: '(555) 456-7890',
            hours: 'Closes at 8 PM',
            priceRange: '$$',
            image: '🍰',
            coordinates: { lat: 40.7120, lng: -74.0075 },
            specialties: ['Chocolate Cake', 'Croissants', 'Macarons'],
            reviews: 445,
            isOpen: true,
            deliveryTime: '15-25 min',
            featured: true
        },
        {
            id: 'map-rest-5',
            name: 'Coffee Corner',
            category: 'coffee',
            rating: 4.3,
            distance: '0.2 mi',
            address: '654 Wall St, New York, NY',
            phone: '(555) 567-8901',
            hours: 'Open until 9 PM',
            priceRange: '$',
            image: '☕',
            coordinates: { lat: 40.7140, lng: -74.0050 },
            specialties: ['Espresso', 'Latte Art', 'Fresh Pastries'],
            reviews: 298,
            isOpen: true,
            deliveryTime: '10-15 min',
            featured: false
        }
    ]

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setNearbyRestaurants(mockRestaurants)
            setLoading(false)
        }, 1000)
    }, [])

    const filteredRestaurants = nearbyRestaurants.filter(restaurant => 
        filterCategory === 'all' || restaurant.category === filterCategory
    )

    const getDirections = (restaurant) => {
        // In a real app, this would open maps app with directions
        alert(`🗺️ Opening directions to ${restaurant.name}...`)
    }

    const callRestaurant = (phone) => {
        // In a real app, this would initiate a phone call
        alert(`📞 Calling ${phone}...`)
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
                    <p>Finding nearby restaurants...</p>
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
                    <h1 style={{ margin: 0, fontSize: '24px' }}>🗺️ Food Map</h1>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '15px',
                    fontSize: '14px',
                    color: '#666'
                }}>
                    <span>📍</span>
                    <span>Near: {userLocation.name}</span>
                    <button style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff6b6b',
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}>
                        Change Location
                    </button>
                </div>

                {/* View Toggle */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '15px'
                }}>
                    <button
                        onClick={() => setMapView('list')}
                        style={{
                            background: mapView === 'list' ? '#ff6b6b' : '#1a1a1a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '15px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        📋 List View
                    </button>
                    <button
                        onClick={() => setMapView('map')}
                        style={{
                            background: mapView === 'map' ? '#ff6b6b' : '#1a1a1a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '15px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        🗺️ Map View
                    </button>
                </div>

                {/* Category Filter */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'auto',
                    paddingBottom: '5px'
                }}>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setFilterCategory(category.id)}
                            style={{
                                background: filterCategory === category.id ? '#ff6b6b' : '#1a1a1a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '15px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            <span>{category.emoji}</span>
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ padding: '20px' }}>
                {mapView === 'list' ? (
                    /* List View */
                    <div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>
                                {filteredRestaurants.length} restaurants nearby
                            </h3>
                            <button style={{
                                backgroundColor: '#1a1a1a',
                                color: 'white',
                                border: '1px solid #333',
                                borderRadius: '15px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}>
                                Sort by Distance
                            </button>
                        </div>

                        <div style={{
                            display: 'grid',
                            gap: '15px'
                        }}>
                            {filteredRestaurants.map(restaurant => (
                                <div
                                    key={restaurant.id}
                                    style={{
                                        backgroundColor: '#1a1a1a',
                                        borderRadius: '15px',
                                        padding: '20px',
                                        border: restaurant.featured ? '2px solid #ff6b6b' : 'none',
                                        position: 'relative'
                                    }}
                                >
                                    {restaurant.featured && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '20px',
                                            backgroundColor: '#ff6b6b',
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            ⭐ FEATURED
                                        </div>
                                    )}

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '15px',
                                        marginBottom: '15px'
                                    }}>
                                        <div style={{ fontSize: '3rem' }}>
                                            {restaurant.image}
                                        </div>
                                        
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                marginBottom: '5px'
                                            }}>
                                                <h4 style={{ margin: 0, fontSize: '18px' }}>
                                                    {restaurant.name}
                                                </h4>
                                                <span style={{
                                                    backgroundColor: restaurant.isOpen ? '#00ff88' : '#ff4757',
                                                    color: '#000',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    fontSize: '10px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {restaurant.isOpen ? 'OPEN' : 'CLOSED'}
                                                </span>
                                            </div>
                                            
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '15px',
                                                marginBottom: '8px',
                                                fontSize: '14px',
                                                color: '#999'
                                            }}>
                                                <span>⭐ {restaurant.rating} ({restaurant.reviews})</span>
                                                <span>📍 {restaurant.distance}</span>
                                                <span>{restaurant.priceRange}</span>
                                            </div>
                                            
                                            <p style={{
                                                margin: '0 0 8px 0',
                                                fontSize: '12px',
                                                color: '#666'
                                            }}>
                                                {restaurant.address}
                                            </p>
                                            
                                            <p style={{
                                                margin: '0 0 10px 0',
                                                fontSize: '12px',
                                                color: '#666'
                                            }}>
                                                {restaurant.hours} • Delivery: {restaurant.deliveryTime}
                                            </p>

                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '5px',
                                                marginBottom: '15px'
                                            }}>
                                                {restaurant.specialties.slice(0, 3).map((specialty, index) => (
                                                    <span
                                                        key={index}
                                                        style={{
                                                            backgroundColor: '#333',
                                                            color: 'white',
                                                            padding: '2px 8px',
                                                            borderRadius: '10px',
                                                            fontSize: '11px'
                                                        }}
                                                    >
                                                        {specialty}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr 1fr',
                                        gap: '10px'
                                    }}>
                                        <button
                                            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                                            style={{
                                                backgroundColor: '#ff6b6b',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '20px',
                                                padding: '8px 12px',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            🍽️ View Menu
                                        </button>
                                        <button
                                            onClick={() => getDirections(restaurant)}
                                            style={{
                                                backgroundColor: '#1a1a1a',
                                                color: 'white',
                                                border: '1px solid #333',
                                                borderRadius: '20px',
                                                padding: '8px 12px',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            🗺️ Directions
                                        </button>
                                        <button
                                            onClick={() => callRestaurant(restaurant.phone)}
                                            style={{
                                                backgroundColor: '#1a1a1a',
                                                color: 'white',
                                                border: '1px solid #333',
                                                borderRadius: '20px',
                                                padding: '8px 12px',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            📞 Call
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Map View */
                    <div>
                        {/* Mock Map Interface */}
                        <div style={{
                            backgroundColor: '#1a1a1a',
                            borderRadius: '15px',
                            height: '400px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Map Background */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(45deg, #2c3e50, #34495e)',
                                opacity: 0.3
                            }}></div>
                            
                            {/* Restaurant Pins */}
                            {filteredRestaurants.map((restaurant, index) => (
                                <div
                                    key={restaurant.id}
                                    onClick={() => setSelectedRestaurant(restaurant)}
                                    style={{
                                        position: 'absolute',
                                        top: `${20 + index * 15}%`,
                                        left: `${30 + index * 10}%`,
                                        backgroundColor: restaurant.featured ? '#ff6b6b' : '#74b9ff',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                        border: '3px solid white',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    {restaurant.image}
                                </div>
                            ))}

                            {/* User Location Pin */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: '#00ff88',
                                color: '#000',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                border: '3px solid white',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                            }}>
                                📍
                            </div>

                            {/* Map Controls */}
                            <div style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px'
                            }}>
                                <button style={{
                                    backgroundColor: 'white',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '5px',
                                    width: '30px',
                                    height: '30px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}>+</button>
                                <button style={{
                                    backgroundColor: 'white',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '5px',
                                    width: '30px',
                                    height: '30px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}>-</button>
                            </div>
                        </div>

                        {/* Selected Restaurant Info */}
                        {selectedRestaurant && (
                            <div style={{
                                backgroundColor: '#1a1a1a',
                                borderRadius: '15px',
                                padding: '20px',
                                border: '2px solid #ff6b6b'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    marginBottom: '15px'
                                }}>
                                    <div style={{ fontSize: '3rem' }}>
                                        {selectedRestaurant.image}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>
                                            {selectedRestaurant.name}
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            fontSize: '14px',
                                            color: '#999'
                                        }}>
                                            <span>⭐ {selectedRestaurant.rating}</span>
                                            <span>📍 {selectedRestaurant.distance}</span>
                                            <span style={{
                                                backgroundColor: selectedRestaurant.isOpen ? '#00ff88' : '#ff4757',
                                                color: '#000',
                                                padding: '2px 8px',
                                                borderRadius: '10px',
                                                fontSize: '10px',
                                                fontWeight: 'bold'
                                            }}>
                                                {selectedRestaurant.isOpen ? 'OPEN' : 'CLOSED'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedRestaurant(null)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'white',
                                            fontSize: '20px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '10px'
                                }}>
                                    <button
                                        onClick={() => navigate(`/restaurant/${selectedRestaurant.id}`)}
                                        style={{
                                            backgroundColor: '#ff6b6b',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '10px 16px',
                                            fontSize: '14px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        View Menu
                                    </button>
                                    <button
                                        onClick={() => getDirections(selectedRestaurant)}
                                        style={{
                                            backgroundColor: '#1a1a1a',
                                            color: 'white',
                                            border: '1px solid #333',
                                            borderRadius: '20px',
                                            padding: '10px 16px',
                                            fontSize: '14px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Get Directions
                                    </button>
                                </div>
                            </div>
                        )}
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
                <button onClick={() => navigate('/map')} style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    🗺️<span style={{ fontSize: '10px' }}>Map</span>
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

export default FoodMap