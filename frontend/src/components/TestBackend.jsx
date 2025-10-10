import { useState } from 'react'
import axiosInstance from '../api/axiosInstance'

function TestBackend() {
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)

    const testConnection = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get('/api/test')
            setResult(`✅ Backend connected! Response: ${JSON.stringify(response.data)}`)
        } catch (error) {
            setResult(`❌ Backend connection failed: ${error.message}`)
        }
        setLoading(false)
    }

    const testRegistration = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.post('/api/auth/user/register', {
                name: 'Test User',
                email: `test${Date.now()}@example.com`,
                password: 'password123'
            }, {
                withCredentials: true
            })
            setResult(`✅ Registration test successful! Response: ${JSON.stringify(response.data)}`)
        } catch (error) {
            setResult(`❌ Registration test failed: ${error.response?.data?.message || error.message}`)
        }
        setLoading(false)
    }

    const checkCookies = () => {
        const cookies = document.cookie
        setResult(`🍪 Current cookies: ${cookies || 'No cookies found (this is normal for httpOnly cookies)'}`)
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Backend Connection Test</h2>

            <div style={{ marginBottom: '1rem' }}>
                <button
                    onClick={testConnection}
                    disabled={loading}
                    style={{
                        padding: '0.5rem 1rem',
                        marginRight: '1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Testing...' : 'Test Connection'}
                </button>

                <button
                    onClick={testRegistration}
                    disabled={loading}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '1rem'
                    }}
                >
                    {loading ? 'Testing...' : 'Test Registration'}
                </button>

                <button
                    onClick={checkCookies}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Check Cookies
                </button>
            </div>

            {result && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: result.includes('✅') ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${result.includes('✅') ? '#bbf7d0' : '#fecaca'}`,
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    whiteSpace: 'pre-wrap'
                }}>
                    {result}
                </div>
            )}
        </div>
    )
}

export default TestBackend