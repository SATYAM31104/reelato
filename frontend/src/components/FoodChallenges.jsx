import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FoodChallenges = () => {
    const navigate = useNavigate()
    const [activeChallenges, setActiveChallenges] = useState([])
    const [userProgress, setUserProgress] = useState({})
    const [completedChallenges, setCompletedChallenges] = useState([])
    const [selectedChallenge, setSelectedChallenge] = useState(null)
    const [loading, setLoading] = useState(true)

    const mockChallenges = [
        {
            id: 'spicy-week',
            title: '🌶️ Spicy Food Week',
            description: 'Try 5 different spicy dishes this week',
            emoji: '🌶️',
            difficulty: 'Medium',
            reward: '🏆 Spice Master Badge',
            progress: 2,
            target: 5,
            timeLeft: '4 days',
            participants: 1240,
            trending: true,
            tasks: [
                { id: 1, name: 'Try Korean spicy ramen', completed: true },
                { id: 2, name: 'Eat Indian curry', completed: true },
                { id: 3, name: 'Have Mexican jalapeño dish', completed: false },
                { id: 4, name: 'Try Thai spicy salad', completed: false },
                { id: 5, name: 'Eat Szechuan pepper dish', completed: false }
            ]
        },
        {
            id: 'dessert-explorer',
            title: '🍰 Dessert Explorer',
            description: 'Discover 3 new dessert places',
            emoji: '🍰',
            difficulty: 'Easy',
            reward: '🎂 Sweet Tooth Badge',
            progress: 1,
            target: 3,
            timeLeft: '6 days',
            participants: 890,
            trending: false,
            tasks: [
                { id: 1, name: 'Visit a new bakery', completed: true },
                { id: 2, name: 'Try artisan ice cream', completed: false },
                { id: 3, name: 'Taste gourmet chocolate', completed: false }
            ]
        },
        {
            id: 'street-food',
            title: '🌮 Street Food Safari',
            description: 'Explore 4 different street food vendors',
            emoji: '🌮',
            difficulty: 'Hard',
            reward: '🚚 Street Food Legend Badge',
            progress: 0,
            target: 4,
            timeLeft: '10 days',
            participants: 567,
            trending: true,
            tasks: [
                { id: 1, name: 'Try food truck tacos', completed: false },
                { id: 2, name: 'Eat from a hot dog cart', completed: false },
                { id: 3, name: 'Visit night market stall', completed: false },
                { id: 4, name: 'Try street vendor sandwich', completed: false }
            ]
        }
    ]

    const mockCompletedChallenges = [
        {
            id: 'pizza-month',
            title: '🍕 Pizza Month',
            reward: '🏆 Pizza Connoisseur',
            completedDate: '2 weeks ago',
            emoji: '🍕'
        },
        {
            id: 'healthy-habits',
            title: '🥗 Healthy Habits',
            reward: '💚 Health Warrior',
            completedDate: '1 month ago',
            emoji: '🥗'
        }
    ]

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setActiveChallenges(mockChallenges)
            setCompletedChallenges(mockCompletedChallenges)
            setLoading(false)
        }, 1000)
    }, [])

    const joinChallenge = (challengeId) => {
        setActiveChallenges(prev => 
            prev.map(challenge => 
                challenge.id === challengeId 
                    ? { ...challenge, participants: challenge.participants + 1, joined: true }
                    : challenge
            )
        )
    }

    const completeTask = (challengeId, taskId) => {
        setActiveChallenges(prev => 
            prev.map(challenge => {
                if (challenge.id === challengeId) {
                    const updatedTasks = challenge.tasks.map(task => 
                        task.id === taskId ? { ...task, completed: true } : task
                    )
                    const completedCount = updatedTasks.filter(task => task.completed).length
                    return {
                        ...challenge,
                        tasks: updatedTasks,
                        progress: completedCount
                    }
                }
                return challenge
            })
        )
    }

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return '#00ff88'
            case 'Medium': return '#feca57'
            case 'Hard': return '#ff6b6b'
            default: return '#74b9ff'
        }
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
                    <p>Loading challenges...</p>
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
                    <h1 style={{ margin: 0, fontSize: '24px' }}>🏆 Food Challenges</h1>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    Complete challenges to earn badges and discover new foods!
                </p>
            </div>

            <div style={{ padding: '20px' }}>
                {/* Active Challenges */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ 
                        fontSize: '20px', 
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        🔥 Active Challenges
                    </h2>
                    
                    <div style={{
                        display: 'grid',
                        gap: '20px'
                    }}>
                        {activeChallenges.map(challenge => (
                            <div
                                key={challenge.id}
                                style={{
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '15px',
                                    padding: '20px',
                                    border: challenge.trending ? '2px solid #ff6b6b' : 'none',
                                    position: 'relative'
                                }}
                            >
                                {challenge.trending && (
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
                                        🔥 TRENDING
                                    </div>
                                )}

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '15px',
                                    marginBottom: '15px'
                                }}>
                                    <div style={{
                                        fontSize: '3rem',
                                        minWidth: '60px'
                                    }}>
                                        {challenge.emoji}
                                    </div>
                                    
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '8px'
                                        }}>
                                            <h3 style={{ margin: 0, fontSize: '18px' }}>
                                                {challenge.title}
                                            </h3>
                                            <span style={{
                                                backgroundColor: getDifficultyColor(challenge.difficulty),
                                                color: '#000',
                                                padding: '2px 8px',
                                                borderRadius: '10px',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }}>
                                                {challenge.difficulty}
                                            </span>
                                        </div>
                                        
                                        <p style={{
                                            margin: '0 0 10px 0',
                                            fontSize: '14px',
                                            color: '#999'
                                        }}>
                                            {challenge.description}
                                        </p>
                                        
                                        <div style={{
                                            display: 'flex',
                                            gap: '15px',
                                            fontSize: '12px',
                                            color: '#666',
                                            marginBottom: '15px'
                                        }}>
                                            <span>⏰ {challenge.timeLeft}</span>
                                            <span>👥 {challenge.participants} joined</span>
                                            <span>🎁 {challenge.reward}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '8px'
                                    }}>
                                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                            Progress: {challenge.progress}/{challenge.target}
                                        </span>
                                        <span style={{ fontSize: '14px', color: '#ff6b6b' }}>
                                            {Math.round((challenge.progress / challenge.target) * 100)}%
                                        </span>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '8px',
                                        backgroundColor: '#333',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${(challenge.progress / challenge.target) * 100}%`,
                                            height: '100%',
                                            backgroundColor: '#ff6b6b',
                                            transition: 'width 0.3s ease'
                                        }}></div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{
                                    display: 'flex',
                                    gap: '10px'
                                }}>
                                    <button
                                        onClick={() => setSelectedChallenge(challenge)}
                                        style={{
                                            backgroundColor: '#ff6b6b',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '8px 16px',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            flex: 1
                                        }}
                                    >
                                        View Tasks
                                    </button>
                                    {!challenge.joined && (
                                        <button
                                            onClick={() => joinChallenge(challenge.id)}
                                            style={{
                                                backgroundColor: '#1a1a1a',
                                                color: 'white',
                                                border: '1px solid #333',
                                                borderRadius: '20px',
                                                padding: '8px 16px',
                                                fontSize: '14px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Join
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Completed Challenges */}
                {completedChallenges.length > 0 && (
                    <div>
                        <h2 style={{ 
                            fontSize: '20px', 
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            ✅ Completed Challenges
                        </h2>
                        
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '15px'
                        }}>
                            {completedChallenges.map(challenge => (
                                <div
                                    key={challenge.id}
                                    style={{
                                        backgroundColor: '#1a1a1a',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        textAlign: 'center',
                                        border: '2px solid #00ff88'
                                    }}
                                >
                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                                        {challenge.emoji}
                                    </div>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                                        {challenge.title}
                                    </h4>
                                    <div style={{
                                        backgroundColor: '#00ff88',
                                        color: '#000',
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        marginBottom: '8px',
                                        display: 'inline-block'
                                    }}>
                                        {challenge.reward}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                                        Completed {challenge.completedDate}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Challenge Details Modal */}
            {selectedChallenge && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: '20px',
                        padding: '30px',
                        maxWidth: '400px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '20px' }}>
                                {selectedChallenge.emoji} {selectedChallenge.title}
                            </h3>
                            <button
                                onClick={() => setSelectedChallenge(null)}
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

                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ marginBottom: '15px', fontSize: '16px' }}>Tasks:</h4>
                            {selectedChallenge.tasks.map(task => (
                                <div
                                    key={task.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px',
                                        backgroundColor: task.completed ? '#00ff8820' : '#333',
                                        borderRadius: '8px',
                                        marginBottom: '8px'
                                    }}
                                >
                                    <button
                                        onClick={() => completeTask(selectedChallenge.id, task.id)}
                                        disabled={task.completed}
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            border: task.completed ? 'none' : '2px solid #666',
                                            backgroundColor: task.completed ? '#00ff88' : 'transparent',
                                            color: task.completed ? '#000' : 'transparent',
                                            cursor: task.completed ? 'default' : 'pointer',
                                            fontSize: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {task.completed && '✓'}
                                    </button>
                                    <span style={{
                                        fontSize: '14px',
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        color: task.completed ? '#666' : 'white'
                                    }}>
                                        {task.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setSelectedChallenge(null)}
                            style={{
                                backgroundColor: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '12px 24px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

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
                <button onClick={() => navigate('/challenges')} style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    🏆<span style={{ fontSize: '10px' }}>Challenges</span>
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

export default FoodChallenges