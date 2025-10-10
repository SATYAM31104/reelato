import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import '../styles/createFood.css'

const CreateFood = () => {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        video: null
    })

    // UI state
    const [loading, setLoading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [videoPreview, setVideoPreview] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [message, setMessage] = useState({ type: '', text: '' })

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear messages when user starts typing
        if (message.text) {
            setMessage({ type: '', text: '' })
        }
    }

    // Handle file selection
    const handleFileSelect = (file) => {
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('video/')) {
            setMessage({
                type: 'error',
                text: 'Please select a valid video file (MP4, MOV, AVI, etc.)'
            })
            return
        }

        // Validate file size (50MB limit)
        const maxSize = 50 * 1024 * 1024 // 50MB
        if (file.size > maxSize) {
            setMessage({
                type: 'error',
                text: 'Video file size must be less than 50MB'
            })
            return
        }

        // Set file and create preview
        setFormData(prev => ({
            ...prev,
            video: file
        }))

        // Create video preview URL
        const previewUrl = URL.createObjectURL(file)
        setVideoPreview(previewUrl)

        setMessage({
            type: 'success',
            text: 'Video uploaded successfully! Ready to create your food item.'
        })
    }

    // Handle drag events
    const handleDragOver = (e) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setDragOver(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            handleFileSelect(files[0])
        }
    }

    // Handle file input change
    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        handleFileSelect(file)
    }

    // Remove video
    const removeVideo = () => {
        setFormData(prev => ({
            ...prev,
            video: null
        }))
        setVideoPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        setMessage({ type: '', text: '' })
    }

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // Validate form
    const validateForm = () => {
        if (!formData.name.trim()) {
            setMessage({
                type: 'error',
                text: 'Please enter a food item name'
            })
            return false
        }

        if (!formData.description.trim()) {
            setMessage({
                type: 'error',
                text: 'Please enter a description for your food item'
            })
            return false
        }

        if (!formData.video) {
            setMessage({
                type: 'error',
                text: 'Please upload a video of your food item'
            })
            return false
        }

        return true
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            setLoading(true)
            setUploadProgress(0)
            setMessage({ type: '', text: '' })

            // Create FormData for file upload
            const submitData = new FormData()
            submitData.append('name', formData.name.trim())
            submitData.append('description', formData.description.trim())
            submitData.append('video', formData.video)

            // Upload with progress tracking
            const response = await axiosInstance.post('/api/food', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                    setUploadProgress(progress)
                }
            })

            console.log('Food item created successfully:', response.data)

            // Success message
            setMessage({
                type: 'success',
                text: '🎉 Food item created successfully! Your delicious creation is now live on ReelBites.'
            })

            // Reset form after delay
            setTimeout(() => {
                setFormData({
                    name: '',
                    description: '',
                    video: null
                })
                setVideoPreview(null)
                setUploadProgress(0)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }

                // Optionally redirect to feed
                // navigate('/feed')
            }, 3000)

        } catch (error) {
            console.error('Error creating food item:', error)

            let errorMessage = 'Failed to create food item. Please try again.'

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error.response?.status === 401) {
                errorMessage = 'Please log in as a food partner to create food items.'
            } else if (error.response?.status === 413) {
                errorMessage = 'Video file is too large. Please choose a smaller file.'
            }

            setMessage({
                type: 'error',
                text: errorMessage
            })
        } finally {
            setLoading(false)
            setUploadProgress(0)
        }
    }

    return (
        <div className="create-food-container">
            <div className="create-food-wrapper fade-in-up">
                {/* Header */}
                <div className="create-food-header">
                    <h1 className="create-food-title">🍽️ Create Food Item</h1>
                    <p className="create-food-subtitle">
                        Share your delicious creations with the ReelBites community
                    </p>
                </div>

                {/* Form */}
                <div className="create-food-form-container">
                    {/* Messages */}
                    {message.text && (
                        <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
                            <span>{message.type === 'success' ? '✅' : '❌'}</span>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="create-food-form">
                        {/* Food Name */}
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                <span className="form-label-icon">🍕</span>
                                Food Item Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Margherita Pizza, Chicken Biryani, Chocolate Cake"
                                className="form-input"
                                maxLength={100}
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label htmlFor="description" className="form-label">
                                <span className="form-label-icon">📝</span>
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your food item... What makes it special? What ingredients do you use? How is it prepared?"
                                className="form-input form-textarea"
                                maxLength={500}
                            />
                            <div style={{
                                fontSize: 'var(--font-size-xs)',
                                color: 'var(--text-secondary)',
                                textAlign: 'right',
                                marginTop: 'var(--spacing-1)'
                            }}>
                                {formData.description.length}/500 characters
                            </div>
                        </div>

                        {/* Video Upload */}
                        <div className="form-group">
                            <label className="form-label">
                                <span className="form-label-icon">🎥</span>
                                Food Video
                            </label>

                            <div
                                className={`video-upload-area ${dragOver ? 'drag-over' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="video-upload-content">
                                    <div className="video-upload-icon">🎬</div>
                                    <div className="video-upload-text">
                                        {dragOver ? 'Drop your video here!' : 'Upload Food Video'}
                                    </div>
                                    <div className="video-upload-subtext">
                                        Drag & drop your video file here, or click to browse
                                    </div>
                                    <button type="button" className="video-upload-button">
                                        Choose Video File
                                    </button>
                                    <div style={{
                                        fontSize: 'var(--font-size-xs)',
                                        color: 'var(--text-secondary)',
                                        marginTop: 'var(--spacing-2)'
                                    }}>
                                        Supported formats: MP4, MOV, AVI • Max size: 50MB
                                    </div>
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleFileInputChange}
                                className="video-input-hidden"
                            />

                            {/* Video Preview */}
                            {videoPreview && (
                                <div className="video-preview-container">
                                    <video
                                        src={videoPreview}
                                        controls
                                        className="video-preview"
                                    />
                                    <div className="video-preview-overlay">
                                        <button
                                            type="button"
                                            onClick={removeVideo}
                                            className="video-preview-button"
                                            title="Remove video"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* File Info */}
                            {formData.video && (
                                <div className="file-info">
                                    <div className="file-info-item">
                                        <span>📁 File name:</span>
                                        <span>{formData.video.name}</span>
                                    </div>
                                    <div className="file-info-item">
                                        <span>📏 File size:</span>
                                        <span>{formatFileSize(formData.video.size)}</span>
                                    </div>
                                    <div className="file-info-item">
                                        <span>🎭 File type:</span>
                                        <span>{formData.video.type}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Upload Progress */}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-button"
                        >
                            {loading && <span className="loading-spinner"></span>}
                            {loading ? 'Creating Food Item...' : '🚀 Create Food Item'}
                        </button>

                        {/* Navigation Links */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 'var(--spacing-4)',
                            marginTop: 'var(--spacing-4)',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                type="button"
                                onClick={() => navigate('/feed')}
                                style={{
                                    background: 'none',
                                    border: '2px solid #ff6b6b',
                                    color: '#ff6b6b',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--spacing-3) var(--spacing-6)',
                                    fontSize: 'var(--font-size-base)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-normal)'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#ff6b6b'
                                    e.target.style.color = 'white'
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'transparent'
                                    e.target.style.color = '#ff6b6b'
                                }}
                            >
                                🍽️ View Food Feed
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/general')}
                                style={{
                                    background: 'none',
                                    border: '2px solid var(--text-secondary)',
                                    color: 'var(--text-secondary)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--spacing-3) var(--spacing-6)',
                                    fontSize: 'var(--font-size-base)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-normal)'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = 'var(--text-secondary)'
                                    e.target.style.color = 'white'
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'transparent'
                                    e.target.style.color = 'var(--text-secondary)'
                                }}
                            >
                                🏠 Browse All
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateFood