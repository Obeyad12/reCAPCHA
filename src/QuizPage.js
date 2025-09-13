import React, { useState } from "react"
import './App.css'

function QuizPage({ course, onBackToDashboard }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [answers, setAnswers] = useState([])

  // Sample quiz questions for different courses
  const quizData = {
    calculus: [
      {
        question: "What is the derivative of x²?",
        options: ["2x", "x", "2", "x²"],
        correct: "2x"
      },
      {
        question: "What is the integral of 2x?",
        options: ["x²", "x² + C", "2", "2x + C"],
        correct: "x² + C"
      },
      {
        question: "What is the derivative of sin(x)?",
        options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
        correct: "cos(x)"
      },
      {
        question: "What is the limit of (x²-1)/(x-1) as x approaches 1?",
        options: ["0", "1", "2", "undefined"],
        correct: "2"
      },
      {
        question: "What is the derivative of e^x?",
        options: ["e^x", "xe^(x-1)", "ln(x)", "x"],
        correct: "e^x"
      },
      {
        question: "What is the integral of 1/x?",
        options: ["ln|x| + C", "x + C", "1/x² + C", "e^x + C"],
        correct: "ln|x| + C"
      },
      {
        question: "What is the second derivative of x³?",
        options: ["3x²", "6x", "x²", "3x"],
        correct: "6x"
      },
      {
        question: "What is the derivative of ln(x)?",
        options: ["1/x", "x", "ln(x)", "e^x"],
        correct: "1/x"
      },
      {
        question: "What is the chain rule formula?",
        options: ["(f∘g)'(x) = f'(g(x))·g'(x)", "f'(x) + g'(x)", "f'(x)·g'(x)", "f(x) + g(x)"],
        correct: "(f∘g)'(x) = f'(g(x))·g'(x)"
      },
      {
        question: "What is the integral of cos(x)?",
        options: ["sin(x) + C", "-sin(x) + C", "cos(x) + C", "-cos(x) + C"],
        correct: "sin(x) + C"
      }
    ],
    "linear-algebra": [
      {
        question: "What is a matrix with the same number of rows and columns called?",
        options: ["Square matrix", "Identity matrix", "Zero matrix", "Diagonal matrix"],
        correct: "Square matrix"
      },
      {
        question: "What is the determinant of a 2x2 identity matrix?",
        options: ["0", "1", "2", "-1"],
        correct: "1"
      },
      {
        question: "What does it mean for vectors to be linearly independent?",
        options: ["They are perpendicular", "No vector can be written as a combination of others", "They have the same length", "They point in the same direction"],
        correct: "No vector can be written as a combination of others"
      },
      {
        question: "What is the rank of a matrix?",
        options: ["Number of rows", "Number of columns", "Number of linearly independent rows", "Total number of elements"],
        correct: "Number of linearly independent rows"
      },
      {
        question: "What is an eigenvalue?",
        options: ["A scalar λ where Av = λv", "The largest element in a matrix", "The trace of a matrix", "The determinant of a matrix"],
        correct: "A scalar λ where Av = λv"
      },
      {
        question: "What is the dot product of vectors (1,2) and (3,4)?",
        options: ["7", "11", "14", "10"],
        correct: "11"
      },
      {
        question: "What is the transpose of matrix [[1,2],[3,4]]?",
        options: ["[[1,3],[2,4]]", "[[4,3],[2,1]]", "[[1,2],[3,4]]", "[[2,1],[4,3]]"],
        correct: "[[1,3],[2,4]]"
      },
      {
        question: "What is the dimension of the vector space R³?",
        options: ["2", "3", "4", "9"],
        correct: "3"
      },
      {
        question: "What is a basis of a vector space?",
        options: ["Any set of vectors", "A linearly independent spanning set", "The largest set of vectors", "A set of perpendicular vectors"],
        correct: "A linearly independent spanning set"
      },
      {
        question: "What is the inverse of a 2x2 matrix [[a,b],[c,d]]?",
        options: ["1/(ad-bc) * [[d,-b],[-c,a]]", "[[d,b],[c,a]]", "[[a,c],[b,d]]", "Cannot be determined"],
        correct: "1/(ad-bc) * [[d,-b],[-c,a]]"
      }
    ],
    biology: [
      {
        question: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Cytoplasm"],
        correct: "Mitochondria"
      },
      {
        question: "What process do plants use to make food?",
        options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
        correct: "Photosynthesis"
      },
      {
        question: "What is DNA?",
        options: ["Deoxyribonucleic acid", "Ribonucleic acid", "Protein", "Carbohydrate"],
        correct: "Deoxyribonucleic acid"
      },
      {
        question: "How many chambers does a human heart have?",
        options: ["2", "3", "4", "5"],
        correct: "4"
      },
      {
        question: "What is the basic unit of life?",
        options: ["Tissue", "Organ", "Cell", "Organism"],
        correct: "Cell"
      },
      {
        question: "What gas do plants absorb from the atmosphere during photosynthesis?",
        options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
        correct: "Carbon dioxide"
      },
      {
        question: "What is the largest organ in the human body?",
        options: ["Liver", "Brain", "Lungs", "Skin"],
        correct: "Skin"
      },
      {
        question: "What type of blood cell fights infection?",
        options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
        correct: "White blood cells"
      },
      {
        question: "What is the process by which cells divide?",
        options: ["Meiosis", "Mitosis", "Osmosis", "Diffusion"],
        correct: "Mitosis"
      },
      {
        question: "What is the scientific name for humans?",
        options: ["Homo erectus", "Homo habilis", "Homo sapiens", "Homo neanderthalensis"],
        correct: "Homo sapiens"
      }
    ],
    physics: [
      {
        question: "What is the speed of light in vacuum?",
        options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"],
        correct: "300,000 km/s"
      },
      {
        question: "What is Newton's first law?",
        options: ["F=ma", "An object at rest stays at rest unless acted upon", "E=mc²", "V=IR"],
        correct: "An object at rest stays at rest unless acted upon"
      },
      {
        question: "What is the unit of force?",
        options: ["Joule", "Newton", "Watt", "Pascal"],
        correct: "Newton"
      },
      {
        question: "What is the acceleration due to gravity on Earth?",
        options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11 m/s²"],
        correct: "9.8 m/s²"
      },
      {
        question: "What is Einstein's mass-energy equivalence formula?",
        options: ["E=mc", "E=mc²", "E=m²c", "E=2mc"],
        correct: "E=mc²"
      },
      {
        question: "What is the unit of electrical resistance?",
        options: ["Volt", "Ampere", "Ohm", "Coulomb"],
        correct: "Ohm"
      },
      {
        question: "What type of wave is sound?",
        options: ["Electromagnetic", "Longitudinal", "Transverse", "Standing"],
        correct: "Longitudinal"
      },
      {
        question: "What is absolute zero in Celsius?",
        options: ["-273.15°C", "-300°C", "-250°C", "-200°C"],
        correct: "-273.15°C"
      },
      {
        question: "What is the formula for kinetic energy?",
        options: ["KE = mv", "KE = ½mv²", "KE = mv²", "KE = 2mv"],
        correct: "KE = ½mv²"
      },
      {
        question: "What particle has no electric charge?",
        options: ["Proton", "Electron", "Neutron", "Ion"],
        correct: "Neutron"
      }
    ],
    chemistry: [
      {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: "Au"
      },
      {
        question: "What is the pH of pure water?",
        options: ["6", "7", "8", "9"],
        correct: "7"
      },
      {
        question: "What is the most abundant gas in Earth's atmosphere?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"],
        correct: "Nitrogen"
      },
      {
        question: "What is the atomic number of carbon?",
        options: ["4", "6", "8", "12"],
        correct: "6"
      },
      {
        question: "What is the chemical formula for water?",
        options: ["H₂O", "HO₂", "H₃O", "H₂O₂"],
        correct: "H₂O"
      },
      {
        question: "What is the lightest element?",
        options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
        correct: "Hydrogen"
      },
      {
        question: "What is the chemical symbol for sodium?",
        options: ["So", "Sd", "Na", "S"],
        correct: "Na"
      },
      {
        question: "What type of bond involves sharing electrons?",
        options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
        correct: "Covalent"
      },
      {
        question: "What is the formula for methane?",
        options: ["CH₄", "C₂H₆", "CH₃", "C₂H₄"],
        correct: "CH₄"
      },
      {
        question: "What is Avogadro's number approximately?",
        options: ["6.02 × 10²³", "3.14 × 10²³", "9.81 × 10²³", "1.60 × 10²³"],
        correct: "6.02 × 10²³"
      }
    ],
    history: [
      {
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correct: "1945"
      },
      {
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
        correct: "George Washington"
      },
      {
        question: "Which empire was ruled by Julius Caesar?",
        options: ["Greek Empire", "Roman Empire", "Persian Empire", "Egyptian Empire"],
        correct: "Roman Empire"
      },
      {
        question: "In which year did the Berlin Wall fall?",
        options: ["1987", "1988", "1989", "1990"],
        correct: "1989"
      },
      {
        question: "Who wrote the Declaration of Independence?",
        options: ["George Washington", "Benjamin Franklin", "John Adams", "Thomas Jefferson"],
        correct: "Thomas Jefferson"
      },
      {
        question: "Which ancient wonder of the world was located in Alexandria?",
        options: ["Hanging Gardens", "Lighthouse of Alexandria", "Colossus of Rhodes", "Statue of Zeus"],
        correct: "Lighthouse of Alexandria"
      },
      {
        question: "What year did the American Civil War begin?",
        options: ["1860", "1861", "1862", "1863"],
        correct: "1861"
      },
      {
        question: "Who was known as the 'Iron Lady'?",
        options: ["Queen Elizabeth II", "Margaret Thatcher", "Golda Meir", "Indira Gandhi"],
        correct: "Margaret Thatcher"
      },
      {
        question: "Which civilization built Machu Picchu?",
        options: ["Aztec", "Maya", "Inca", "Olmec"],
        correct: "Inca"
      },
      {
        question: "In which year did the Titanic sink?",
        options: ["1910", "1911", "1912", "1913"],
        correct: "1912"
      }
    ],
    music: [
      {
        question: "How many strings does a standard guitar have?",
        options: ["4", "5", "6", "7"],
        correct: "6"
      },
      {
        question: "What is the highest female singing voice?",
        options: ["Alto", "Soprano", "Mezzo-soprano", "Contralto"],
        correct: "Soprano"
      },
      {
        question: "How many keys are on a standard piano?",
        options: ["76", "84", "88", "92"],
        correct: "88"
      },
      {
        question: "What does 'forte' mean in music?",
        options: ["Soft", "Loud", "Fast", "Slow"],
        correct: "Loud"
      },
      {
        question: "Which composer wrote 'The Four Seasons'?",
        options: ["Bach", "Mozart", "Vivaldi", "Beethoven"],
        correct: "Vivaldi"
      },
      {
        question: "What is a group of four musicians called?",
        options: ["Trio", "Quartet", "Quintet", "Ensemble"],
        correct: "Quartet"
      },
      {
        question: "How many beats are in a 4/4 time signature per measure?",
        options: ["3", "4", "6", "8"],
        correct: "4"
      },
      {
        question: "What is the lowest male singing voice?",
        options: ["Tenor", "Baritone", "Bass", "Alto"],
        correct: "Bass"
      },
      {
        question: "Which instrument family does the trumpet belong to?",
        options: ["Woodwind", "Brass", "Percussion", "String"],
        correct: "Brass"
      },
      {
        question: "What does 'allegro' mean in music?",
        options: ["Very slow", "Slow", "Fast", "Very fast"],
        correct: "Fast"
      }
    ],
    // Add more courses as needed
    default: [
      {
        question: "This is a sample question for your course.",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: "Option A"
      }
    ]
  }

  const questions = quizData[course] || quizData.default
  const currentQ = questions[currentQuestion]

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)

    if (selectedAnswer === currentQ.correct) {
      setScore(score + 1)
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
    } else {
      setShowResults(true)
    }
  }

  const getCourseName = (courseId) => {
    const courseNames = {
      'calculus': 'Calculus',
      'linear-algebra': 'Linear Algebra',
      'biology': 'Biology',
      'physics': 'Physics',
      'chemistry': 'Chemistry',
      'history': 'History',
      'music': 'Music'
    }
    return courseNames[courseId] || courseId
  }

  if (showResults) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="quiz-header">
            <h1 className="quiz-title">Quiz Complete! 🎉</h1>
          </div>
          
          <div className="quiz-results">
            <div className="score-display">
              <h2>Your Score</h2>
              <div className="score-circle">
                <span className="score-number">{score}</span>
                <span className="score-total">/{questions.length}</span>
              </div>
              <p className="score-percentage">
                {Math.round((score / questions.length) * 100)}%
              </p>
            </div>
            
            <div className="results-message">
              {score === questions.length ? (
                <p className="perfect-score">Perfect! You mastered this {getCourseName(course)} material! 🌟</p>
              ) : score >= questions.length * 0.7 ? (
                <p className="good-score">Great job! You have a solid understanding! 👏</p>
              ) : (
                <p className="needs-improvement">Keep studying! You'll get it next time! 💪</p>
              )}
            </div>
          </div>
          
          <button className="quiz-button" onClick={onBackToDashboard}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <h1 className="quiz-title">{getCourseName(course)} Quiz</h1>
          <div className="quiz-progress">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
        
        <div className="quiz-content">
          <h2 className="question-text">{currentQ.question}</h2>
          
          <div className="options-container">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        <div className="quiz-footer">
          <button 
            className="quiz-button"
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
          >
            {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizPage