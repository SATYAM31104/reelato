import '../styles/auth.css'

const CreateFood = () => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">🍽️ Food Partner Dashboard</h1>
                    <p className="auth-subtitle">Welcome to your food creation hub!</p>
                </div>
                
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                        Welcome, Food Partner!
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        You've successfully logged in to your food partner dashboard. 
                        Here you can manage your restaurant's food items, upload videos, and showcase your delicious creations to the ReelBites community.
                    </p>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                        gap: '1rem',
                        marginTop: '2rem'
                    }}>
                        <div style={{
                            padding: '1.5rem',
                            backgroundColor: 'var(--card-bg)',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                            <h3>Add Food Items</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Create and manage your restaurant's menu items
                            </p>
                        </div>
                        
                        <div style={{
                            padding: '1.5rem',
                            backgroundColor: 'var(--card-bg)',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎥</div>
                            <h3>Upload Videos</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Share engaging videos of your food creations
                            </p>
                        </div>
                        
                        <div style={{
                            padding: '1.5rem',
                            backgroundColor: 'var(--card-bg)',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                            <h3>View Analytics</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Track your food items' performance and engagement
                            </p>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '2rem' }}>
                        <a 
                            href="/general" 
                            className="btn-secondary" 
                            style={{ marginRight: '1rem' }}
                        >
                            View Food Feed
                        </a>
                        <button className="btn-primary">
                            Start Creating
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateFood;