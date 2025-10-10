import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

const RestaurantStore = () => {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [foodItems, setFoodItems] = useState([])
  const [loading, setLoading] = useState(true)
  // Mock restaurant data - replace with real API call later
  const mockRestaurants = {
    'mario-pizzeria': {
      id: 'mario-pizzeria',
      name: "Mario's Pizzeria",
      ownerName: "Mario Rossi",
      description: "Authentic Italian pizzas made with love and traditional recipes passed down through generations.",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
      address: "123 Italian Street, Food City",
      phone: "+1 (555) 123-4567",
      rating: 4.8,
      totalReviews: 324
    },
    'kfc-chicken': {
      id: 'kfc-chicken',
      name: "KFC Style Chicken",
      ownerName: "Colonel Sanders Jr.",
      description: "Crispy fried chicken with secret blend of 11 herbs and spices. Finger lickin' good!",
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&h=600&fit=crop",
      address: "456 Chicken Lane, Food City",
      phone: "+1 (555) 234-5678",
      rating: 4.6,
      totalReviews: 567
    },
    'sakura-sushi': {
      id: 'sakura-sushi',
      name: "Sakura Sushi",
      ownerName: "Hiroshi Tanaka",
      description: "Fresh sushi and sashimi prepared by master chefs with premium ingredients from Japan.",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
      address: "789 Sushi Avenue, Food City",
      phone: "+1 (555) 345-6789",
      rating: 4.9,
      totalReviews: 234
    },
    'burger-house': {
      id: 'burger-house',
      name: "Burger House",
      ownerName: "Bob Wilson",
      description: "Juicy gourmet burgers made with premium beef and fresh ingredients. Best burgers in town!",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
      address: "321 Burger Street, Food City",
      phone: "+1 (555) 456-7890",
      rating: 4.7,
      totalReviews: 445
    },
    'italian-corner': {
      id: 'italian-corner',
      name: "Italian Corner",
      ownerName: "Giuseppe Bianchi",
      description: "Traditional Italian cuisine with homemade pasta and authentic flavors from Italy.",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop",
      address: "654 Pasta Plaza, Food City",
      phone: "+1 (555) 567-8901",
      rating: 4.8,
      totalReviews: 298
    }
  }

  // Mock food items data - replace with real API call later
  const mockFoodItems = {
    'mario-pizzeria': [
      {
        id: 1,
        name: "Margherita Pizza",
        description: "Classic pizza with fresh mozzarella, basil, and tomato sauce",
        price: 18.99,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
        category: "Pizza",
        isAvailable: true
      },
      {
        id: 2,
        name: "Pepperoni Pizza",
        description: "Traditional pepperoni with mozzarella cheese and tomato sauce",
        price: 21.99,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
        category: "Pizza",
        isAvailable: true
      },
      {
        id: 3,
        name: "Quattro Stagioni",
        description: "Four seasons pizza with mushrooms, artichokes, ham, and olives",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        category: "Pizza",
        isAvailable: false
      }
    ],
    'kfc-chicken': [
      {
        id: 4,
        name: "Original Recipe Chicken",
        description: "8-piece bucket of our famous fried chicken with secret spices",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
        category: "Chicken",
        isAvailable: true
      },
      {
        id: 5,
        name: "Chicken Wings",
        description: "Crispy chicken wings with choice of sauce",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=300&fit=crop",
        category: "Chicken",
        isAvailable: true
      }
    ],
    'sakura-sushi': [
      {
        id: 6,
        name: "Salmon Sashimi",
        description: "Fresh Atlantic salmon sliced to perfection",
        price: 16.99,
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
        category: "Sashimi",
        isAvailable: true
      },
      {
        id: 7,
        name: "California Roll",
        description: "Crab, avocado, and cucumber with sesame seeds",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
        category: "Rolls",
        isAvailable: true
      }
    ],
    'burger-house': [
      {
        id: 8,
        name: "Classic Cheeseburger",
        description: "Beef patty with cheese, lettuce, tomato, and special sauce",
        price: 13.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        category: "Burgers",
        isAvailable: true
      },
      {
        id: 9,
        name: "BBQ Bacon Burger",
        description: "Beef patty with bacon, BBQ sauce, and onion rings",
        price: 16.99,
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop",
        category: "Burgers",
        isAvailable: true
      }
    ],
    'italian-corner': [
      {
        id: 10,
        name: "Spaghetti Carbonara",
        description: "Creamy pasta with pancetta, eggs, and parmesan cheese",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
        category: "Pasta",
        isAvailable: true
      },
      {
        id: 11,
        name: "Fettuccine Alfredo",
        description: "Rich and creamy white sauce with fettuccine pasta",
        price: 13.99,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
        category: "Pasta",
        isAvailable: true
      }
    ]
  }

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true)
        console.log('Fetching data for restaurant ID:', restaurantId)

        // Fetch food items for this specific restaurant
        const foodResponse = await axiosInstance.get(`/api/food/partner/${restaurantId}`)
        console.log('Restaurant food items response:', foodResponse.data)

        const restaurantFoodItems = foodResponse.data.data

        console.log('Restaurant food items:', restaurantFoodItems)

        console.log('Food items count:', restaurantFoodItems.length)
        console.log('Partner info from food items:', foodResponse.data.partner)

        let partnerInfo = foodResponse.data.partner || restaurantFoodItems[0]?.foodPartner

        // If no partner info from food items, try to fetch partner info directly
        if (!partnerInfo) {
          console.log('No partner info from food items, fetching directly...')
          try {
            const partnerResponse = await axiosInstance.get(`/api/food/partner-info/${restaurantId}`)
            console.log('Direct partner info response:', partnerResponse.data)
            partnerInfo = partnerResponse.data.data
          } catch (partnerError) {
            console.error('Error fetching partner info directly:', partnerError)
          }
        }

        console.log('Final partner info:', partnerInfo)

        if (partnerInfo) {
          const restaurantInfo = {
            id: restaurantId,
            name: partnerInfo.restaurantName || 'Restaurant Name',
            ownerName: partnerInfo.ownerName || 'Owner Name',
            email: partnerInfo.email || '',
            description: `Delicious food from ${partnerInfo.restaurantName || 'our kitchen'}. Fresh ingredients and authentic flavors in every dish.`,
            image: restaurantFoodItems[0]?.video || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
            address: partnerInfo.address || "Food City",
            phone: partnerInfo.phone || "+1 (555) 123-4567",
            rating: 4.8,
            totalReviews: Math.floor(Math.random() * 500) + 50
          }

          // Transform food items
          const transformedFoodItems = restaurantFoodItems.map(item => ({
            id: item._id,
            name: item.name,
            description: item.description,
            price: Math.floor(Math.random() * 20) + 10, // Random price for now
            image: item.video, // Using video as image for now
            category: "Food",
            isAvailable: true,
            createdAt: item.createdAt
          }))

          console.log('Setting restaurant info:', restaurantInfo)
          setRestaurant(restaurantInfo)
          setFoodItems(transformedFoodItems)
        } else {
          // No partner info found
          console.log('No partner info found at all')
          setRestaurant(null)
          setFoodItems([])
        }

      } catch (error) {
        console.error('Error fetching restaurant data:', error)
        setRestaurant(null)
        setFoodItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurantData()
  }, [restaurantId])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #ff6b6b',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px' }}>Loading restaurant...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        textAlign: 'center'
      }}>
        <div>
          <h2 style={{ color: '#333', marginBottom: '1rem' }}>Restaurant Not Found</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>The restaurant you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/feed')}
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
            Back to Feed
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button
            onClick={() => navigate('/feed')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            ←
          </button>
          <h1 style={{ color: '#333', margin: 0, fontSize: '24px' }}>
            {restaurant.name}
          </h1>
        </div>
      </div>

      {/* Restaurant Info */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <video
              src={restaurant.image}
              controls
              muted
              loop
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
              onError={(e) => {
                // Fallback to placeholder if video fails to load
                e.target.style.display = 'none'
                const fallbackDiv = document.createElement('div')
                fallbackDiv.style.cssText = `
                  width: 100%;
                  height: 200px;
                  background: linear-gradient(135deg, #ff6b6b, #feca57);
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 3rem;
                `
                fallbackDiv.innerHTML = '🍽️'
                e.target.parentNode.insertBefore(fallbackDiv, e.target)
              }}
            />
            <div>
              <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>
                {restaurant.name}
              </h2>
              <p style={{ color: '#666', marginBottom: '1rem', fontSize: '16px' }}>
                Owner: {restaurant.ownerName}
              </p>
              <p style={{ color: '#555', marginBottom: '1rem', lineHeight: '1.6' }}>
                {restaurant.description}
              </p>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ color: '#ff6b6b', fontSize: '18px', fontWeight: 'bold' }}>
                    ⭐ {restaurant.rating}
                  </span>
                  <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                    ({restaurant.totalReviews} reviews)
                  </span>
                </div>
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                <p style={{ margin: '0.25rem 0' }}>📍 {restaurant.address}</p>
                <p style={{ margin: '0.25rem 0' }}>📞 {restaurant.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Food Items */}
        <div>
          <h3 style={{ color: '#333', marginBottom: '1.5rem', fontSize: '24px' }}>
            Menu Items ({foodItems.length})
          </h3>

          {foodItems.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#666', fontSize: '18px' }}>
                No menu items available yet.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {foodItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease',
                    opacity: item.isAvailable ? 1 : 0.6
                  }}
                  onMouseOver={(e) => {
                    if (item.isAvailable) {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <video
                      src={item.image}
                      muted
                      loop
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
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
                      width: '50px',
                      height: '50px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '1.2rem',
                      color: 'white',
                      cursor: 'pointer',
                      opacity: 0.8,
                      transition: 'opacity 0.3s ease'
                    }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = '1'
                        const video = e.target.parentElement.querySelector('video')
                        if (video) video.play()
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = '0.8'
                        const video = e.target.parentElement.querySelector('video')
                        if (video) video.pause()
                      }}
                      onClick={(e) => {
                        const video = e.target.parentElement.querySelector('video')
                        if (video) {
                          if (video.paused) {
                            video.play()
                          } else {
                            video.pause()
                          }
                        }
                      }}
                    >
                      ▶️
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem'
                    }}>
                      <h4 style={{
                        color: '#333',
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: '600'
                      }}>
                        {item.name}
                      </h4>
                      <span style={{
                        backgroundColor: item.isAvailable ? '#e8f5e8' : '#ffe8e8',
                        color: item.isAvailable ? '#2d5a2d' : '#d32f2f',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {item.isAvailable ? 'Available' : 'Sold Out'}
                      </span>
                    </div>
                    <p style={{
                      color: '#666',
                      margin: '0 0 1rem 0',
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}>
                      {item.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        color: '#ff6b6b',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>
                        ${item.price}
                      </span>
                      <button
                        disabled={!item.isAvailable}
                        style={{
                          backgroundColor: item.isAvailable ? '#ff6b6b' : '#ccc',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '8px 16px',
                          fontSize: '14px',
                          cursor: item.isAvailable ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          if (item.isAvailable) {
                            e.target.style.backgroundColor = '#ff5252'
                          }
                        }}
                        onMouseOut={(e) => {
                          if (item.isAvailable) {
                            e.target.style.backgroundColor = '#ff6b6b'
                          }
                        }}
                      >
                        {item.isAvailable ? 'Order Now' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .restaurant-info {
              grid-template-columns: 1fr !important;
              text-align: center;
            }
            
            .food-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default RestaurantStore