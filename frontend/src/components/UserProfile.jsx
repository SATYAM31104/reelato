import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

const UserProfile = () => {
    const navigate = useNavigate()
    const { userId } = useParams()
    const [profile, setProfile] = useState(null)
    const [userVideos, setUserVideos] = useState([])
    const [savedVideos, setSavedVideos] = useState([])
    const [following, setFollowing] = useState([])
    const [followers, setFollowers] = useState([])
    const [activeTab, setActiveTab] = useState('videos') // videos, saved, following, followers
    const [loading, setLoading] = useState(true)
    const [isOwnProfile, setIsOwnProfile] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)

    useEffect(() => {
        fetchUserProfile()
    }, [userId])

    const fetchUserProfile = async () => {
        try {
            setLoading(true)
            
            // Mock user profile data
            const mockProfile = {
                id: userId || 'current-user',
                name: 'Food Explorer',
                username: '@foodie_explorer',
                bio: '🍕 Pizza lover | 🍜 Ramen enthusiast | 📍 NYC | Sharing the best food finds!',
                avatar: '👤',
                followersCount: 1240,
                followingCount: 890,
                videosCount: 45,
                totalLikes: 15600,
                joinedDate: 'March 2024',
                isVerified: true
            }

            const mockUserVideos = [
                {
                    id: '1',
                    foodName: 'Truffle Pasta',
                    videoUrl: '/videos/pasta.mp4',
                    likes: 234,
                    views: 1200,
                    thumbnail: '🍝'
                },
                {
                    id: '2',
                    foodName: 'Chocolate Cake',
                    videoUrl: '/videos/cake.mp4',
                    likes: 189,
                    views: 890,
                    thumbnail: '🍰'
                }
            ]

            setProfile(mockProfile)
            setUserVideos(mockUserVideos)
            setIsOwnProfile(!userId || userId === 'current-user')
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFollow = async () => {
        try {
            // Mock follow/unfollow
            setIsFollowing(!isFollowing)
            setProfile(prev => ({
                ...prev,
                followersCount: prev.followersCount + (isFollowing ? -1 : 1)
            }))
        } catch (error) {
            console.error('Error following user:', error)
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
                    <p>Loading profile...</p>
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
                borderBottom: '1px solid #333'
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
                    <h1 style={{ margin: 0, fontSize: '20px' }}>
                        {profile?.name}
                        {profile?.isVerified && <span style={{ color: '#1da1f2', marginLeft: '8px' }}>✓</span>}
                    </h1>
                </div>

                {/* Profile Info */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '20px',
                    marginBottom: '20px'
                }}>
                    {/* Avatar */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#333',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        border: '3px solid #ff6b6b'
                    }}>
                        {profile?.avatar}
                    </div>

                    {/* Stats */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            display: 'flex',
                            gap: '20px',
                            marginBottom: '15px'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                    {formatNumber(profile?.videosCount || 0)}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>Videos</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                    {formatNumber(profile?.followersCount || 0)}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>Followers</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                    {formatNumber(profile?.followingCount || 0)}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>Following</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                    {formatNumber(profile?.totalLikes || 0)}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>Likes</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {isOwnProfile ? (
                                <>
                                    <button
                                        onClick={() => navigate('/edit-profile')}
                                        style={{
                                            backgroundColor: '#1a1a1a',
                                            color: 'white',
                                            border: '1px solid #333',
                                            borderRadius: '20px',
                                            padding: '8px 16px',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            flex: 1
                                        }}
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => navigate('/settings')}
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
                                        ⚙️
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleFollow}
                                        style={{
                                            backgroundColor: isFollowing ? '#1a1a1a' : '#ff6b6b',
                                            color: 'white',
                                            border: isFollowing ? '1px solid #333' : 'none',
                                            borderRadius: '20px',
                                            padding: '8px 16px',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            flex: 1
                                        }}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                    <button
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
                                        💬
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div style={{
                    marginBottom: '20px',
                    lineHeight: '1.4'
                }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#999' }}>
                        {profile?.username}
                    </p>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                        {profile?.bio}
                    </p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                        📅 Joined {profile?.joinedDate}
                    </p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '5px'
                }}>
                    {[
                        { id: 'videos', name: 'Videos', emoji: '📹' },
                        { id: 'saved', name: 'Saved', emoji: '🔖' },
                        { id: 'following', name: 'Following', emoji: '👥' },
                        { id: 'followers', name: 'Followers', emoji: '👤' }
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
                {/* Videos Tab */}
                {activeTab === 'videos' && (
                    <div>
                        {userVideos.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                gap: '10px'
                            }}>
                                {userVideos.map(video => (
                                    <div
                                        key={video.id}
                                        style={{
                                            backgroundColor: '#1a1a1a',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            aspectRatio: '9/16'
                                        }}
                                        onClick={() => navigate(`/video/${video.id}`)}
                                    >
                                        <div style={{
                                            width: '100%',
                                            height: '70%',
                                            backgroundColor: '#333',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '24px'
                                        }}>
                                            {video.thumbnail}
                                        </div>
                                        <div style={{ padding: '8px' }}>
                                            <div style={{
                                                fontSize: '11px',
                                                fontWeight: 'bold',
                                                marginBottom: '4px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {video.foodName}
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '10px',
                                                color: '#666'
                                            }}>
                                                <span>❤️ {video.likes}</span>
                                                <span>👁️ {video.views}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                color: '#666'
                            }}>
                                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📹</div>
                                <h3 style={{ marginBottom: '10px', color: 'white' }}>No Videos Yet</h3>
                                <p>Start sharing your food adventures!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Saved Tab */}
                {activeTab === 'saved' && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: '#666'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔖</div>
                        <h3 style={{ marginBottom: '10px', color: 'white' }}>No Saved Videos</h3>
                        <p>Videos you save will appear here</p>
                    </div>
                )}

                {/* Following Tab */}
                {activeTab === 'following' && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: '#666'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👥</div>
                        <h3 style={{ marginBottom: '10px', color: 'white' }}>Following</h3>
                        <p>People you follow will appear here</p>
                    </div>
                )}

                {/* Followers Tab */}
                {activeTab === 'followers' && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: '#666'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👤</div>
                        <h3 style={{ marginBottom: '10px', color: 'white' }}>Followers</h3>
                        <p>Your followers will appear here</p>
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
                <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
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

export default UserProfile