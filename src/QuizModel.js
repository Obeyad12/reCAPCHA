
import React from "react"
import './App.css'

function QuizModel({ isOpen, onClose, onTakeQuiz, courseName }) {
  if (!isOpen) return null

  return (
    <div className="model-overlay">
      <div className="model-content">
        <div className="model-header">
          <h2 className="model-title">Recording Complete! 🎉</h2>
        </div>
        
        <div className="model-body">
          <p className="model-description">
            Great job! You've finished recording your {courseName} session.
          </p>
          <p className="model-question">
            Would you like to take a quick quiz on the material you just learned?
          </p>
        </div>
        
        <div className="model-footer">
          <button className="model-button secondary" onClick={onClose}>
            No, Back to Dashboard
          </button>
          <button className="model-button primary" onClick={onTakeQuiz}>
            Yes, Take Quiz! 🧠
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizModel