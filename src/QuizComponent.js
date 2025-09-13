import React, { useState } from "react";

function QuizComponent({ quizData = [], onSubmit }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quizData || quizData.length === 0) {
    return <div style={{ textAlign: "center", margin: 32 }}>No quiz available.</div>;
  }

  const handleOptionChange = (qIdx, option) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: option,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let correct = 0;
    quizData.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected && q.a[selected] === true) {
        correct += 1;
      }
    });
    setScore(correct);
    setSubmitted(true);
    if (onSubmit) onSubmit({ score: correct, total: quizData.length });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 500,
          margin: "32px auto",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          padding: 32,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Quiz</h2>
        {quizData.map((q, idx) => (
          <div key={idx} style={{ marginBottom: 28 }}>
            <div style={{ fontWeight: 600, marginBottom: 10 }}>
              {idx + 1}. {q.q}
            </div>
            <div>
              {Object.keys(q.a).map((option) => (
                <label
                  key={option}
                  style={{
                    display: "block",
                    background: "#f8fafc",
                    borderRadius: 6,
                    padding: "8px 12px",
                    marginBottom: 8,
                    cursor: submitted ? "default" : "pointer",
                    border:
                      submitted && userAnswers[idx] === option
                        ? q.a[option]
                          ? "2px solid #27ae60"
                          : "2px solid #e74c3c"
                        : "1px solid #e0e0e0",
                    color:
                      submitted && userAnswers[idx] === option
                        ? q.a[option]
                          ? "#27ae60"
                          : "#e74c3c"
                        : "#222",
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={option}
                    checked={userAnswers[idx] === option}
                    onChange={() => handleOptionChange(idx, option)}
                    disabled={submitted}
                    style={{ marginRight: 10 }}
                  />
                  {option}
                  {submitted && userAnswers[idx] === option && (
                    <span style={{ marginLeft: 10, fontWeight: 500 }}>
                      {q.a[option] ? "✔️" : "✖️"}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
        {!submitted && (
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#3498db",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "12px 0",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            Submit Quiz
          </button>
        )}
      </form>
      {submitted && (
        <>
          <div
            style={{
              maxWidth: 500,
              margin: "24px auto 0",
              background: "#eafaf1",
              borderRadius: 8,
              padding: 20,
              fontSize: 18,
              color: "#229954",
              textAlign: "center",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            SCORE: {score} / {quizData.length}
          </div>
          <div
            style={{
              maxWidth: 500,
              margin: "24px auto",
              background: "#f8fafc",
              borderRadius: 8,
              padding: 20,
              fontSize: 14,
              wordBreak: "break-all",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Quiz Data:</div>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
              {JSON.stringify(quizData, null, 2)}
            </pre>
          </div>
        </>
      )}
    </>
  );
}

export default QuizComponent;