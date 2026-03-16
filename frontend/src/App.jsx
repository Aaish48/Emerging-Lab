import { useState, useRef, useCallback } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ChatArea from './components/ChatArea.jsx'
import Header from './components/Header.jsx'
import ToastContainer from './components/ToastContainer.jsx'

export default function App() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [messages, setMessages] = useState([])
  const [isAsking, setIsAsking] = useState(false)
  const [toasts, setToasts] = useState([])
  const toastIdRef = useRef(0)

  const showToast = useCallback((msg, type = 'info') => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  const handleFileUpload = useCallback(async (file) => {
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Only PDF files are supported.', 'error')
      return
    }

    setIsUploading(true)
    setIsReady(false)
    setUploadedFile({ name: file.name, size: file.size })
    setMessages([])

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    } )
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Upload failed')

      setIsReady(true)
      showToast('Document processed — you can now ask questions!', 'success')
    } catch (err) {
      showToast(err.message || 'Upload failed. Is the backend running?', 'error')
      setUploadedFile(null)
    } finally {
      setIsUploading(false)
    }
  }, [showToast])

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null)
    setIsReady(false)
    setMessages([])
  }, [])

  const handleAsk = useCallback(async (question) => {
    if (!question.trim() || isAsking) return
    if (!isReady) {
      showToast('Please upload and process a PDF first.', 'error')
      return
    }

    const userMsg = { role: 'user', text: question, time: now() }
    setMessages(prev => [...prev, userMsg])
    setIsAsking(true)

    try {
      const res = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, filename: uploadedFile.name })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Request failed')

      const aiMsg = { role: 'ai', text: data.answer, time: now() }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      showToast(err.message || 'Failed to get answer. Is the backend running?', 'error')
      setMessages(prev => prev.filter(m => m !== userMsg))
    } finally {
      setIsAsking(false)
    }
  }, [isReady, isAsking, uploadedFile, showToast])

  const handleClearChat = useCallback(() => {
    setMessages([])
  }, [])

  return (
    <>
      <Header />
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: 'calc(100vh - 64px)' }}>
        <Sidebar
          uploadedFile={uploadedFile}
          isUploading={isUploading}
          isReady={isReady}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
          messageCount={messages.filter(m => m.role === 'user').length}
        />
        <ChatArea
          messages={messages}
          isAsking={isAsking}
          isReady={isReady}
          onAsk={handleAsk}
          onClear={handleClearChat}
        />
      </div>
      <ToastContainer toasts={toasts} />
    </>
  )
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
