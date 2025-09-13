"use client"

import { useState, useRef } from "react"
import GoogleDocButton from "./GoogleDocButton.js"
import QuizComponent from "./QuizComponent.js"

const OPENAI_KEY = process.env.REACT_APP_OPENAI_API
const DG_KEY = process.env.REACT_APP_DEEPGRAM_API_KEY

export default function LiveTranscriber({ onBack }) {
  const [isRecording, setIsRecording] = useState(false)
  const [micStatus, setMicStatus] = useState("")
  const [transcript, setTranscript] = useState("")
  const [chunkNotes, setChunkNotes] = useState([])
  const [quizData, setQuizData] = useState([])
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [noteFile, setNoteFile] = useState("")
  const [quizFile, setQuizFile] = useState("")
  const [docJson, setDocJson] = useState([])
  const [view, setView] = useState("transcript")
  const [showQuizComponent, setShowQuizComponent] = useState(false);
  const wordBufferRef = useRef([])
  const mediaRecorderRef = useRef(null)
  const socketRef = useRef(null)

  // Helper: call OpenAI for notes (for .txt), quiz JSON, and Google Doc JSON
  async function getNotesForChunk(text, allNotes, fullTranscript) {
    setIsSummarizing(true)

    const txtPrompt = `
You are an expert note-taker. Given the following transcript chunk, generate a grammatically correct and accurate plain text summary for a React site. Use clear section headers (surrounded by ===), bullet points (start with "- "), and keep formatting simple (no markdown, no bold, no asterisks). Separate sections with a blank line. Do not include the transcript.

Transcript chunk:
"""${text}"""

Notes:
`
    const quizPrompt = `
Given the following transcript chunk, generate a quiz question in this JSON format:
{"q": "question text", "a": ["answer1": true/false, "answer2": true/false, "answer3": true/false, "answer4": true/false]}
Only output valid JSON, no explanation. Only one answer should be true.

Transcript chunk:
"""${text}"""
`
    const docPrompt = `
You are an expert academic note-taker. Given the following transcript chunk, create a JSON array of sections for visually pleasing, concise, and beautifully organized Google Docs notes. Each section should have a "section" (string, the section header) and "content" (string, can include bullet points, bold using **double asterisks**, and spacing for readability). Use clear section headers, bullet points, bold for key terms, and spacing for readability. Make the formatting as visually pleasing as possible for Google Docs.

Format:
[
  {"section": "Section Title", "content": "Your formatted notes for this section."},
  ...
]

Transcript chunk:
"""${text}"""

Notes JSON:
`
    // Get .txt notes
    const txtRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY.replace(/"/g, "")}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert at summarizing and note-taking." },
          { role: "user", content: txtPrompt },
        ],
        max_tokens: 400,
        temperature: 0.3,
      }),
    })
    const txtData = await txtRes.json()
    let txtSummary = ""
    if (txtData.choices && txtData.choices[0] && txtData.choices[0].message) {
      txtSummary = txtData.choices[0].message.content.trim()
    }

    // Get quiz JSON
    const quizRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY.replace(/"/g, "")}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert at creating quizzes." },
          { role: "user", content: quizPrompt },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    })
    const quizDataRaw = await quizRes.json()
    let quizObj = null
    if (quizDataRaw.choices && quizDataRaw.choices[0] && quizDataRaw.choices[0].message) {
      try {
        quizObj = JSON.parse(quizDataRaw.choices[0].message.content.replace(/```json|```/g, "").replace(/[\n\r]+/g, ""))
      } catch (e) {
        quizObj = null
      }
    }

    // Get Google Doc JSON
    const docRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY.replace(/"/g, "")}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert at summarizing and note-taking." },
          { role: "user", content: docPrompt },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    })
    const docData = await docRes.json()
    let docArr = []
    if (docData.choices && docData.choices[0] && docData.choices[0].message) {
      try {
        docArr = JSON.parse(docData.choices[0].message.content.replace(/```json|```/g, "").replace(/[\n\r]+/g, ""))
      } catch (e) {
        docArr = []
      }
    }

    setIsSummarizing(false)
    setChunkNotes((prevNotes) => {
      const headerMatch = txtSummary.match(/^===\s*(.*?)\s*===/)
      const header = headerMatch ? headerMatch[1] : "Summary"
      const body = txtSummary.replace(/^===.*?===\s*/s, "")
      const formatted = `\n${header}\n${body.trim()}`
      const updatedTxt = prevNotes.length === 0 ? formatted.trim() : prevNotes.join("\n\n") + "\n\n" + formatted.trim()
      setNoteFile(updatedTxt)
      return [...prevNotes, formatted.trim()]
    })

    setDocJson((prevDoc) => {
      const updatedDoc = [...prevDoc, ...docArr]
      return updatedDoc
    })

    if (quizObj) {
      setQuizData((prevQuiz) => {
        const updatedQuiz = [...prevQuiz, quizObj]
        setQuizFile(JSON.stringify(updatedQuiz, null, 2))
        return updatedQuiz
      })
    }
  }

  const handleStartRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setMicStatus("🎤 Microphone access granted! Starting transcription...")
        setIsRecording(true)
        setTranscript("")
        setChunkNotes([])
        setQuizData([])
        setNoteFile("")
        setQuizFile("")
        setDocJson([])
        wordBufferRef.current = []

        const mediaRecorder = new window.MediaRecorder(stream, { mimeType: "audio/webm" })
        mediaRecorderRef.current = mediaRecorder

        const socket = new window.WebSocket("wss://api.deepgram.com/v1/listen", ["token", DG_KEY])
        socketRef.current = socket

        socket.onopen = () => {
          mediaRecorder.addEventListener("dataavailable", (event) => {
            if (socket.readyState === 1) {
              socket.send(event.data)
            }
          })
          mediaRecorder.start(1000)
        }

        socket.onmessage = (message) => {
          const received = JSON.parse(message.data)
          const newTranscript = received.channel?.alternatives?.[0]?.transcript
          if (newTranscript) {
            setTranscript((prev) => {
              const updated = prev + " " + newTranscript
              const words = newTranscript.trim().split(/\s+/)
              wordBufferRef.current = wordBufferRef.current.concat(words)
              while (wordBufferRef.current.length >= 100 && !isSummarizing) {
                const chunk = wordBufferRef.current.slice(0, 100).join(" ")
                getNotesForChunk(chunk, chunkNotes, updated)
                wordBufferRef.current = wordBufferRef.current.slice(100)
              }
              return updated
            })
          }
        }

        socket.onclose = () => setIsRecording(false)
        socket.onerror = () => setIsRecording(false)
      } catch (err) {
        setMicStatus("❌ Microphone access denied.")
      }
    } else {
      setIsRecording(false)
      setMicStatus("⏹️ Recording stopped.")
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }
      if (socketRef.current && socketRef.current.readyState === 1) {
        socketRef.current.close()
      }
    }
  }

  const handleDownloadTxt = () => {
    const blob = new Blob([noteFile], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "notes.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadJson = () => {
    const blob = new Blob([quizFile], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "quiz"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="transcriber-container">
      <div className="transcriber-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        <div className="transcriber-title-section">
          <h1 className="transcriber-title">Live Transcriber</h1>
          <p className="transcriber-subtitle">Real-time audio transcription with AI-powered notes</p>
        </div>
      </div>

      <div className="transcriber-content">
        {/* Recording Controls */}
        <div className="recording-controls">
          <button className={`record-button ${isRecording ? "recording" : ""}`} onClick={handleStartRecording}>
            <div className="record-icon">
              {isRecording ? <div className="stop-icon"></div> : <div className="mic-icon">🎤</div>}
            </div>
            <span className="record-text">{isRecording ? "Stop Recording" : "Start Recording"}</span>
          </button>

          {isRecording && (
            <div className="recording-indicator">
              <div className="pulse-dot"></div>
              <span>Recording in progress...</span>
            </div>
          )}
        </div>

        {/* Status Message */}
        {micStatus && (
          <div className={`status-message ${micStatus.includes("denied") ? "error" : "success"}`}>{micStatus}</div>
        )}

        {/* AI Processing Indicator */}
        {isSummarizing && (
          <div className="ai-processing">
            <div className="processing-spinner"></div>
            <span>AI is generating notes and quiz questions...</span>
          </div>
        )}

        {/* View Toggle */}
        <div className="view-toggle">
          <button
            className={`toggle-btn ${view === "transcript" ? "active" : ""}`}
            onClick={() => setView("transcript")}
          >
            <span className="toggle-icon">📝</span>
            Live Transcription
          </button>
          <button className={`toggle-btn ${view === "notes" ? "active" : ""}`} onClick={() => setView("notes")}>
            <span className="toggle-icon">📚</span>
            Live Notes
          </button>
        </div>

        {/* Content Display */}
        <div className="content-display">
          {view === "transcript" && (
            <div className="transcript-section">
              <div className="section-header">
                <h3>Live Transcript</h3>
                {transcript && <span className="word-count">{transcript.split(" ").length} words</span>}
              </div>
              <div className="transcript-content">
                {transcript ? (
                  <div className="transcript-text">{transcript}</div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🎤</div>
                    <p>Start recording to see live transcription</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {view === "notes" && (
            <div className="notes-section">
              <div className="section-header">
                <h3>AI-Generated Notes</h3>
                {chunkNotes.length > 0 && <span className="notes-count">{chunkNotes.length} sections</span>}
              </div>
              <div className="notes-content">
                {chunkNotes.length > 0 ? (
                  chunkNotes.map((notes, idx) => (
                    <div key={idx} className="note-chunk">
                      <div className="note-text">{notes}</div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <p>AI-generated notes will appear here as you record</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Download Actions */}
        {!isRecording && (noteFile || quizFile) && (
          <div className="download-section">
            <h3 className="download-title">Export Your Content</h3>
            <div className="download-actions">
              {noteFile && (
                <button className="download-btn notes" onClick={handleDownloadTxt}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                  </svg>
                  Download Notes (.txt)
                </button>
              )}

              {quizFile && (
                <button
                  className="download-btn quiz"
                  onClick={() => setShowQuizComponent(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <circle cx="12" cy="13" r="2" />
                    <path d="M12 10v6" />
                  </svg>
                  Take Quiz
                </button>
              )}

              {docJson.length > 0 && (
                <GoogleDocButton
                  notesJson={docJson}
                  buttonText={
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                      </svg>
                      Send to Google Docs
                    </>
                  }
                  className="download-btn google-docs"
                />
              )}
            </div>
          </div>
        )}

        {/* Render QuizComponent if requested */}
        {showQuizComponent && (
          <div style={{ marginTop: 32 }}>
            <QuizComponent
              quizData={quizData}
              onSubmit={() => setShowQuizComponent(false)}
            />
            <button
              style={{
                margin: "16px auto 0",
                display: "block",
                background: "#eee",
                border: "1px solid #ccc",
                borderRadius: 6,
                padding: "8px 24px",
                cursor: "pointer"
              }}
              onClick={() => setShowQuizComponent(false)}
            >
              Close Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
