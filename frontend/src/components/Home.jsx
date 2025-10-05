import '../styles/auth.css'

function Home() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">ReelBites</h1>
          <p className="auth-subtitle">Discover amazing food through short videos</p>
          
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ textAlign: 'center', margin: '1rem 0' }}>Choose Your Account Type</h3>
            
            <a href="/user/register" style={{ textDecoration: 'none', padding: '12px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
              Register as Normal User
            </a>
            
            <a href="/user/login" style={{ textDecoration: 'none', padding: '12px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
              Login as User
            </a>
            
            <a href="/food-partner/register" style={{ textDecoration: 'none', padding: '12px', backgroundColor: '#f59e0b', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
              Register as Food Partner
            </a>
            
            <a href="/food-partner/login" style={{ textDecoration: 'none', padding: '12px', backgroundColor: '#d97706', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
              Login as Food Partner
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home