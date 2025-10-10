import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FoodDelivery = () => {
    const navigate = useNavigate()
    const [nearbyRestaurants, setNearbyRestaurants] = useState([])
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)
    const [cart, setCart] = useState([])
    const [orderHistory, setOrderHistory] = useState([])
    const [activeTab, setActiveTab] = useState('nearby') // nearby, cart, orders
    const [loading, setLoading] = useState(true)
    const [userLocation, setUserLocation] = useState('New York, NY')

    const mockRestaurants = [
        {
            id: 'rest-1',
            name: 'Italiano Bistro',
            cuisine: 'Italian',
            rating: 4.8,
            deliveryTime: '25-35 min',
            deliveryFee: 2.99,
            minOrder: 15,
            distance: '0.8 mi',
            image: '🍕',
            popular: true,
            menu: [
                { id: 'item-1', name: 'Margherita Pizza', price: 18.99, description: 'Fresh mozzarella, tomato sauce, basil', image: '🍕' },
                { id: 'item-2', name: 'Truffle Pasta', price: 24.99, description: 'Homemade pasta with truffle cream sauce', image: '🍝' },
                { id: 'item-3', name: 'Caesar Salad', price: 12.99, description: 'Crisp romaine, parmesan, croutons', image: '🥗' }
            ]
        },
        {
            id: 'rest-2',
            name: 'Tokyo Ramen House',
            cuisine: 'Japanese',
            rating: 4.6,
            deliveryTime: '30-40 min',
            deliveryFee: 3.49,
            minOrder: 20,
            distance: '1.2 mi',
            image: '🍜',
            popular: false,
            menu: [
                { id: 'item-4', name: 'Tonkotsu Ramen', price: 16.99, description: 'Rich pork bone broth with chashu', image: '🍜' },
                { id: 'item-5', name: 'Chicken Teriyaki', price: 19.99, description: 'Grilled chicken with teriyaki glaze', image: '🍗' },
                { id: 'item-6', name: 'Miso Soup', price: 4.99, description: 'Traditional soybean paste soup', image: '🍲' }
            ]
        },
        {
            id: 'rest-3',
            name: 'Burger Palace',
            cuisine: 'American',
            rating: 4.4,
            deliveryTime: '20-30 min',
            deliveryFee: 1.99,
            minOrder: 12,
            distance: '0.5 mi',
            image: '🍔',
            popular: true,
            menu: [
                { id: 'item-7', name: 'Classic Burger', price: 14.99, description: 'Beef patty, lettuce, tomato, onion', image: '🍔' },
                { id: 'item-8', name: 'Loaded Fries', price: 8.99, description: 'Fries with cheese, bacon, green onions', image: '🍟' },
                { id: 'item-9', name: 'Chocolate Shake', price: 5.99, description: 'Thick chocolate milkshake', image: '🥤' }
            ]
        }
    ]

    const mockOrderHistory = [
        {
            id: 'order-1',
            restaurant: 'Italiano Bistro',
            items: ['Margherita Pizza', 'Caesar Salad'],
            total: 34.97,
            status: 'Delivered',
            date: '2 days ago',
            image: '🍕'
        },
        {
            id: 'order-2',
            restaurant: 'Tokyo Ramen House',
            items: ['Tonkotsu Ramen'],
            total: 19.48,
            status: 'Delivered',
            date: '1 week ago',
            image: '🍜'
        }
    ]

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setNearbyRestaurants(mockRestaurants)
            setOrderHistory(mockOrderHistory)
            setLoading(false)
        }, 1000)
    }, [])

    const addToCart = (restaurant, item) => {
        const cartItem = {
            id: Date.now(),
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            ...item,
            quantity: 1
        }
        setCart(prev => [...prev, cartItem])
    }

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(item => item.id !== itemId))
    }

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity === 0) {
            removeFromCart(itemId)
            return
        }
        setCart(prev => prev.map(item => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        ))
    }

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const getDeliveryFee = () => {
        if (cart.length === 0) return 0
        const restaurantId = cart[0].restaurantId
        const restaurant = nearbyRestaurants.find(r => r.id === restaurantId)
        return restaurant ? restaurant.deliveryFee : 2.99
    }

    const placeOrder = () => {
        if (cart.length === 0) return
        
        const newOrder = {
            id: `order-${Date.now()}`,
            restaurant: cart[0].restaurantName,
            items: cart.map(item => `${item.name} x${item.quantity}`),
            total: getCartTotal() + getDeliveryFee(),
            status: 'Preparing',
            date: 'Just now',
            image: cart[0].image
        }
        
        setOrderHistory(prev => [newOrder, ...prev])
        setCart([])
        setActiveTab('orders')
        
        // Show success message
        alert('🎉 Order placed successfully! Your food will be delivered in 25-35 minutes.')
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

    if (selectedRestaurant) {
        return (
            <div style={{ 
                backgroundColor: '#000', 
                minHeight: '100vh', 
                color: 'white',
                paddingBottom: '80px'
            }}>
                {/* Restaurant Header */}
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
                            onClick={() => setSelectedRestaurant(null)}
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
                        <div style={{ flex: 1 }}>
                            <h2 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>
                                {selectedRestaurant.name}
                            </h2>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                fontSize: '12px',
                                color: '#666'
                            }}>
                                <span>⭐ {selectedRestaurant.rating}</span>
                                <span>🚚 {selectedRestaurant.deliveryTime}</span>
                                <span>📍 {selectedRestaurant.distance}</span>
                            </div>
                        </div>
                        <div style={{ fontSize: '3rem' }}>
                            {selectedRestaurant.image}
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '20px' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Menu</h3>
                    <div style={{
                        display: 'grid',
                        gap: '15px'
                    }}>
                        {selectedRestaurant.menu.map(item => (
                            <div
                                key={item.id}
                                style={{
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px'
                                }}
                            >
                                <div style={{ fontSize: '3rem' }}>
                                    {item.image}
                                </div>
                                
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                                        {item.name}
                                    </h4>
                                    <p style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '14px',
                                        color: '#999'
                                    }}>
                                        {item.description}
                                    </p>
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: '#ff6b6b'
                                    }}>
                                        ${item.price}
                                    </div>
                                </div>

                                <button
                                    onClick={() => addToCart(selectedRestaurant, item)}
                                    style={{
                                        backgroundColor: '#ff6b6b',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '20px',
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
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
                    <h1 style={{ margin: 0, fontSize: '24px' }}>🚚 Food Delivery</h1>
                    {cart.length > 0 && (
                        <div style={{
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}>
                            {cart.length}
                        </div>
                    )}
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
                    <span>Delivering to: {userLocation}</span>
                    <button style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff6b6b',
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}>
                        Change
                    </button>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '5px'
                }}>
                    {[
                        { id: 'nearby', name: 'Nearby', emoji: '🏪' },
                        { id: 'cart', name: 'Cart', emoji: '🛒' },
                        { id: 'orders', name: 'Orders', emoji: '📦' }
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
                            {tab.id === 'cart' && cart.length > 0 && (
                                <span style={{
                                    backgroundColor: 'white',
                                    color: '#ff6b6b',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    marginLeft: '5px'
                                }}>
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ padding: '20px' }}>
                {/* Nearby Restaurants */}
                {activeTab === 'nearby' && (
                    <div>
                        <div style={{
                            display: 'grid',
                            gap: '20px'
                        }}>
                            {nearbyRestaurants.map(restaurant => (
                                <div
                                    key={restaurant.id}
                                    onClick={() => setSelectedRestaurant(restaurant)}
                                    style={{
                                        backgroundColor: '#1a1a1a',
                                        borderRadius: '15px',
                                        padding: '20px',
                                        cursor: 'pointer',
                                        border: restaurant.popular ? '2px solid #ff6b6b' : 'none',
                                        position: 'relative'
                                    }}
                                >
                                    {restaurant.popular && (
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
                                            🔥 POPULAR
                                        </div>
                                    )}

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        marginBottom: '15px'
                                    }}>
                                        <div style={{ fontSize: '3rem' }}>
                                            {restaurant.image}
                                        </div>
                                        
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>
                                                {restaurant.name}
                                            </h3>
                                            <p style={{
                                                margin: '0 0 8px 0',
                                                fontSize: '14px',
                                                color: '#999'
                                            }}>
                                                {restaurant.cuisine}
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                gap: '15px',
                                                fontSize: '12px',
                                                color: '#666'
                                            }}>
                                                <span>⭐ {restaurant.rating}</span>
                                                <span>🚚 {restaurant.deliveryTime}</span>
                                                <span>📍 {restaurant.distance}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '12px',
                                        color: '#666'
                                    }}>
                                        <span>Delivery: ${restaurant.deliveryFee}</span>
                                        <span>Min order: ${restaurant.minOrder}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Cart */}
                {activeTab === 'cart' && (
                    <div>
                        {cart.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                color: '#666'
                            }}>
                                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div>
                                <h3 style={{ marginBottom: '10px', color: 'white' }}>Your cart is empty</h3>
                                <p>Add some delicious items to get started!</p>
                                <button
                                    onClick={() => setActiveTab('nearby')}
                                    style={{
                                        backgroundColor: '#ff6b6b',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '20px',
                                        padding: '10px 20px',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        marginTop: '20px'
                                    }}
                                >
                                    Browse Restaurants
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Your Order</h3>
                                
                                {/* Cart Items */}
                                <div style={{ marginBottom: '30px' }}>
                                    {cart.map(item => (
                                        <div
                                            key={item.id}
                                            style={{
                                                backgroundColor: '#1a1a1a',
                                                borderRadius: '12px',
                                                padding: '15px',
                                                marginBottom: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '15px'
                                            }}
                                        >
                                            <div style={{ fontSize: '2rem' }}>
                                                {item.image}
                                            </div>
                                            
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                                                    {item.name}
                                                </h4>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                                                    {item.restaurantName}
                                                </p>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px'
                                            }}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    style={{
                                                        backgroundColor: '#333',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '30px',
                                                        height: '30px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    style={{
                                                        backgroundColor: '#ff6b6b',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '30px',
                                                        height: '30px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div style={{
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                color: '#ff6b6b',
                                                minWidth: '60px',
                                                textAlign: 'right'
                                            }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div style={{
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    marginBottom: '20px'
                                }}>
                                    <h4 style={{ marginBottom: '15px', fontSize: '16px' }}>Order Summary</h4>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '8px',
                                        fontSize: '14px'
                                    }}>
                                        <span>Subtotal</span>
                                        <span>${getCartTotal().toFixed(2)}</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '8px',
                                        fontSize: '14px'
                                    }}>
                                        <span>Delivery Fee</span>
                                        <span>${getDeliveryFee().toFixed(2)}</span>
                                    </div>
                                    <hr style={{ border: '1px solid #333', margin: '15px 0' }} />
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: '#ff6b6b'
                                    }}>
                                        <span>Total</span>
                                        <span>${(getCartTotal() + getDeliveryFee()).toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={placeOrder}
                                    style={{
                                        backgroundColor: '#ff6b6b',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '25px',
                                        padding: '15px 30px',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        width: '100%',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Place Order - ${(getCartTotal() + getDeliveryFee()).toFixed(2)}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Order History */}
                {activeTab === 'orders' && (
                    <div>
                        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Your Orders</h3>
                        
                        {orderHistory.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                color: '#666'
                            }}>
                                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
                                <h3 style={{ marginBottom: '10px', color: 'white' }}>No orders yet</h3>
                                <p>Your order history will appear here</p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gap: '15px'
                            }}>
                                {orderHistory.map(order => (
                                    <div
                                        key={order.id}
                                        style={{
                                            backgroundColor: '#1a1a1a',
                                            borderRadius: '12px',
                                            padding: '15px'
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px',
                                            marginBottom: '10px'
                                        }}>
                                            <div style={{ fontSize: '2rem' }}>
                                                {order.image}
                                            </div>
                                            
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                                                    {order.restaurant}
                                                </h4>
                                                <p style={{
                                                    margin: '0 0 5px 0',
                                                    fontSize: '14px',
                                                    color: '#999'
                                                }}>
                                                    {order.items.join(', ')}
                                                </p>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    fontSize: '12px'
                                                }}>
                                                    <span style={{ color: '#666' }}>{order.date}</span>
                                                    <span style={{
                                                        backgroundColor: order.status === 'Delivered' ? '#00ff88' : '#feca57',
                                                        color: '#000',
                                                        padding: '2px 8px',
                                                        borderRadius: '10px',
                                                        fontSize: '11px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                color: '#ff6b6b'
                                            }}>
                                                ${order.total.toFixed(2)}
                                            </div>
                                        </div>

                                        <button
                                            style={{
                                                backgroundColor: '#333',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '20px',
                                                padding: '8px 16px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                width: '100%'
                                            }}
                                        >
                                            Reorder
                                        </button>
                                    </div>
                                ))}
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
                <button onClick={() => navigate('/delivery')} style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    🚚<span style={{ fontSize: '10px' }}>Delivery</span>
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

export default FoodDelivery