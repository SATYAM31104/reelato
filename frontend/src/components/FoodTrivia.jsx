import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FoodTrivia = () => {
    const navigate = useNavigate()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [score, setScore] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [gameComplete, setGameComplete] = useState(false)
    const [streak, setStreak] = useState(0)

    const triviaQuestions = [
        {
            question: "Which country is famous for inventing pizza?",
            options: ["France", "Italy", "Greece", "Spain"],
            correct: 1,
            emoji: "🍕",
            funFact: "Pizza originated in Naples, Italy in the 18th century!"
        },
        {
            question: "What spice is derived from the Crocus flower?",
            options: ["Turmeric", "Paprika", "Saffron", "Cardamom"],
            correct: 2,
            emoji: "🌸",
            funFact: "Saffron is the world's most expensive spice by weight!"
        },
        {
            question: "Which fruit is known as the 'king of fruits'?",
            options: ["Mango", "Durian", "Pineapple", "Dragon Fruit"],
            correct: 1,
            emoji: "👑",
            funFact: "Durian is called the king of fruits but banned in many hotels due to its smell!"
        },
        {
            question: "What's the main ingredient in traditional hummus?",
            options: ["Lentils", "Black beans", "Chickpeas", "White beans"],
            correct: 2,
            emoji: "🥙",
            funFact: "Hummus has been eaten in the Middle East for thousands of years!"
        },
        {
            question: "Which country consumes the most chocolate per capita?",
            options: ["USA", "Germany", "Switzerland", "Belgium"],
            correct: 2,
            emoji: "🍫",
            funFact: "Switzerland consumes about 19 pounds of chocolate per person per year!"
        },
        {
            question: "What does 'al dente' mean in cooking?",
            options: ["Very soft", "Firm to the bite", "Overcooked", "Raw"],
            correct: 1,
            emoji: "🍝",
            funFact: "Al dente literally means 'to the tooth' in Italian!"
        },
        {
            question: "Which vegetable is used to make traditional coleslaw?",
            options: ["Lettuce", "Spinach", "Cabbage", "Kale"],
            correct: 2,
            emoji: "🥬",
            funFact: "Coleslaw comes from the Dutch term 'koolsla' meaning cabbage salad!"
        },
        {
            question: "What type of pastry is used for profiteroles?",
            options: ["Puff pastry", "Shortcrust", "Choux pastry", "Filo pastry"],
            correct: 2,
            emoji: "🥐",
            funFact: "Choux pastry is cooked twice - once on the stove and once in the oven!"
        }
    ]

    const handleAnswerSelect = (answerIndex) => {
        if (selectedAnswer !== null) return
        
        setSelectedAnswer(answerIndex)
        setShowResult(true)
        
        if (answerIndex === triviaQuestions[currentQuestion].correct) {
            setScore(score + 1)
            setStreak(streak + 1)
        } else {
            setStreak(0)
        }
    }

    const nextQuestion = () => {
        if (currentQuestion < triviaQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        } else {
            setGameComplete(true)
        }
    }

    const resetGame = () => {
        setCurrentQuestion(0)
        setScore(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setGameComplete(false)
        setStreak(0)
    }

    const getScoreMessage = () => {
        const percentage = (score / triviaQuestions.length) * 100
        if (percentage >= 90) return { message: "🏆 Food Master!", color: "#ffd700" }
        if (percentage >= 70) return { message: "🍽️ Foodie Expert!", color: "#ff6b6b" }
        if (percentage >= 50) return { message: "🍕 Food Lover!", color: "#feca57" }
        return { message: "🥄 Keep Learning!", color: "#74b9ff" }
    }

    if (gameComplete) {
        const scoreData = getScoreMessage()
        return (
            <div style={{ 
                backgroundColor: '#000', 
                minHeight: '100vh', 
                color: 'white',
                paddingBottom: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '20px'
            }}>
                <div style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: '20px',
                    padding: '40px',
                    maxWidth: '400px',
                    width: '100%'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                        {scoreData.message.split(' ')[0]}
                    </div>
                    <h2 style={{ 
                        color: scoreData.color, 
                        marginBottom: '20px',
                        fontSize: '24px'
                    }}>
                        {scoreData.message}
                    </h2>
                    <div style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        color: '#ff6b6b'
                    }}>
                        {score}/{triviaQuestions.length}
                    </div>
                    <p style={{ 
                        fontSize: '18px', 
                        marginBottom: '30px',
                        color: '#666'
                    }}>
                        {Math.round((score / triviaQuestions.length) * 100)}% Correct
                    </p>
                    
                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        justifyContent: 'center'
                    }}>
                        <button
                            onClick={resetGame}
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
                            🔄 Play Again
                        </button>
                        <button
                            onClick={() => navigate('/feed')}
                            style={{
                                backgroundColor: '#1a1a1a',
                                color: 'white',
                                border: '1px solid #333',
                                borderRadius: '25px',
                                padding: '12px 24px',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            🏠 Home
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const question = triviaQuestions[currentQuestion]

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
                    justifyContent: 'space-between',
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
                    <h1 style={{ margin: 0, fontSize: '20px' }}>🧠 Food Trivia</h1>
                    <div style={{
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        padding: '5px 12px',
                        borderRadius: '15px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        {score}/{triviaQuestions.length}
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#333',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '10px'
                }}>
                    <div style={{
                        width: `${((currentQuestion + 1) / triviaQuestions.length) * 100}%`,
                        height: '100%',
                        backgroundColor: '#ff6b6b',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#666'
                }}>
                    <span>Question {currentQuestion + 1} of {triviaQuestions.length}</span>
                    {streak > 1 && (
                        <span style={{ color: '#00ff88' }}>
                            🔥 {streak} streak!
                        </span>
                    )}
                </div>
            </div>

            {/* Question */}
            <div style={{ padding: '30px 20px' }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: '20px'
                    }}>
                        {question.emoji}
                    </div>
                    <h2 style={{
                        fontSize: '22px',
                        lineHeight: '1.4',
                        marginBottom: '30px',
                        color: 'white'
                    }}>
                        {question.question}
                    </h2>
                </div>

                {/* Answer Options */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    maxWidth: '400px',
                    margin: '0 auto'
                }}>
                    {question.options.map((option, index) => {
                        let backgroundColor = '#1a1a1a'
                        let borderColor = '#333'
                        
                        if (showResult && selectedAnswer !== null) {
                            if (index === question.correct) {
                                backgroundColor = '#00ff88'
                                borderColor = '#00ff88'
                            } else if (index === selectedAnswer && index !== question.correct) {
                                backgroundColor = '#ff4757'
                                borderColor = '#ff4757'
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                disabled={showResult}
                                style={{
                                    backgroundColor,
                                    color: showResult && (index === question.correct || index === selectedAnswer) ? '#000' : 'white',
                                    border: `2px solid ${borderColor}`,
                                    borderRadius: '15px',
                                    padding: '15px 20px',
                                    fontSize: '16px',
                                    cursor: showResult ? 'default' : 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.3s ease',
                                    opacity: showResult && index !== question.correct && index !== selectedAnswer ? 0.5 : 1
                                }}
                            >
                                <span style={{ 
                                    fontWeight: 'bold', 
                                    marginRight: '10px',
                                    color: showResult && (index === question.correct || index === selectedAnswer) ? '#000' : '#ff6b6b'
                                }}>
                                    {String.fromCharCode(65 + index)}.
                                </span>
                                {option}
                            </button>
                        )
                    })}
                </div>

                {/* Result & Fun Fact */}
                {showResult && (
                    <div style={{
                        marginTop: '30px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            backgroundColor: '#1a1a1a',
                            borderRadius: '15px',
                            padding: '20px',
                            marginBottom: '20px',
                            maxWidth: '400px',
                            margin: '20px auto'
                        }}>
                            <div style={{
                                fontSize: '2rem',
                                marginBottom: '10px'
                            }}>
                                {selectedAnswer === question.correct ? '🎉' : '💡'}
                            </div>
                            <h3 style={{
                                color: selectedAnswer === question.correct ? '#00ff88' : '#ff6b6b',
                                marginBottom: '10px'
                            }}>
                                {selectedAnswer === question.correct ? 'Correct!' : 'Not quite!'}
                            </h3>
                            <p style={{
                                fontSize: '14px',
                                color: '#666',
                                lineHeight: '1.4'
                            }}>
                                {question.funFact}
                            </p>
                        </div>

                        <button
                            onClick={nextQuestion}
                            style={{
                                backgroundColor: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '12px 30px',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            {currentQuestion < triviaQuestions.length - 1 ? 'Next Question →' : 'See Results 🏆'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FoodTrivia