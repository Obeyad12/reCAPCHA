
import React, { useState } from "react"
import './App.css'

function CourseModel({ isOpen, onClose, onSelectCourse }) {
  const [selectedCourse, setSelectedCourse] = useState("")

  const courses = [
    { id: 'calculus', name: 'Calculus', icon: '📐' },
    { id: 'linear-algebra', name: 'Linear Algebra', icon: '🔢' },
    { id: 'biology', name: 'Biology', icon: '🧬' },
    { id: 'physics', name: 'Physics', icon: '⚛️' },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
    { id: 'history', name: 'History', icon: '📚' },
    { id: 'music', name: 'Music', icon: '🎵' }
  ]

  const handleStartRecording = () => {
    if (selectedCourse) {
      onSelectCourse(selectedCourse)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="model-overlay">
      <div className="model-content">
        <div className="model-header">
          <h2 className="model-title">Select Course</h2>
          <button className="model-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="model-body">
          <p className="model-description">Which course would you like to record for?</p>
          
          <div className="course-grid">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`course-card ${selectedCourse === course.id ? 'selected' : ''}`}
                onClick={() => setSelectedCourse(course.id)}
              >
                <div className="course-icon">{course.icon}</div>
                <div className="course-name">{course.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="model-footer">
          <button className="model-button secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="model-button primary" 
            onClick={handleStartRecording}
            disabled={!selectedCourse}
          >
            Start Recording
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseModel