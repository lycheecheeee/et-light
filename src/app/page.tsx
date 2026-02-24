'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

// Types
interface Card {
  id: string
  type: 'finance' | 'life' | 'health' | 'voice' | 'retirement'
  title: string
  subtitle: string
  value?: string
  change?: string
  mood?: 'hot' | 'warm' | 'cool' | 'cold'
  image: string
  delay: number
}

// Particle Component
const Particle = ({ delay, left }: { delay: number; left: number }) => (
  <div
    className="particle"
    style={{
      left: `${left}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${8 + Math.random() * 4}s`,
    }}
  />
)

// Sound Wave Component
const SoundWave = ({ isActive }: { isActive: boolean }) => (
  <div className="flex items-center justify-center gap-1 h-12">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`w-1 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-full ${isActive ? 'sound-wave-bar' : ''}`}
        style={{
          height: isActive ? `${20 + Math.random() * 20}px` : '8px',
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
  </div>
)

// Thinking Animation
const ThinkingDots = () => (
  <div className="flex items-center justify-center gap-2">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="thinking-dot w-3 h-3 bg-cyan-400 rounded-full"
      />
    ))}
  </div>
)

// Element Card Component
const ElementCard = ({ card, onClick }: { card: Card; onClick: () => void }) => {
  const moodColors = {
    hot: 'from-orange-500/20 to-red-500/20',
    warm: 'from-yellow-500/20 to-orange-500/20',
    cool: 'from-cyan-500/20 to-blue-500/20',
    cold: 'from-purple-500/20 to-indigo-500/20',
  }

  const glowColors = {
    hot: 'hover:shadow-[0_0_30px_rgba(255,112,67,0.3)]',
    warm: 'hover:shadow-[0_0_30px_rgba(255,213,79,0.3)]',
    cool: 'hover:shadow-[0_0_30px_rgba(79,195,247,0.3)]',
    cold: 'hover:shadow-[0_0_30px_rgba(124,77,255,0.3)]',
  }

  return (
    <div
      className={`glass-card p-4 cursor-pointer transition-all duration-300 glass-card-hover float-card ${card.mood ? glowColors[card.mood] : ''}`}
      style={{ animationDelay: `${card.delay}s` }}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${card.mood ? moodColors[card.mood] : 'from-cyan-500/10 to-purple-500/10'} rounded-2xl`} />
      <div className="relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={card.image}
              alt={card.title}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">{card.title}</h3>
            <p className="text-white/60 text-xs mt-0.5 truncate">{card.subtitle}</p>
          </div>
        </div>
        
        {card.value && (
          <div className="mt-3 flex items-end justify-between">
            <span className="text-2xl font-bold text-white">{card.value}</span>
            {card.change && (
              <span className={`text-sm font-medium ${card.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {card.change}
              </span>
            )}
          </div>
        )}
        
        {card.mood && (
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full bg-white/10 ${
              card.mood === 'hot' ? 'mood-hot' : 
              card.mood === 'warm' ? 'mood-warm' : 
              card.mood === 'cool' ? 'mood-cool' : 'mood-cold'
            }`}>
              {card.mood === 'hot' ? '🔥 升溫' : 
               card.mood === 'warm' ? '☀️ 觀望' : 
               card.mood === 'cool' ? '❄️ 冷靜' : '🧊 淡靜'}
            </span>
          </div>
        )}
        
        {card.type === 'voice' && (
          <div className="mt-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span className="text-xs text-cyan-400">Net仔話你知</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Voice Modal Component
const VoiceModal = ({ 
  isOpen, 
  onClose, 
  isListening, 
  transcript,
  response,
  isThinking 
}: { 
  isOpen: boolean
  onClose: () => void
  isListening: boolean
  transcript: string
  response: string
  isThinking: boolean
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 max-w-md w-full glow-blue">
        {/* Net仔 Mascot */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Image
              src="/images/netzai-mascot.png"
              alt="Net仔"
              width={80}
              height={80}
              className="rounded-full"
            />
            {isListening && (
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" />
            )}
          </div>
        </div>

        {/* Sound Wave */}
        <div className="flex justify-center mb-4">
          <SoundWave isActive={isListening} />
        </div>

        {/* Status Text */}
        <div className="text-center mb-4">
          {isListening ? (
            <p className="text-cyan-400 text-sm">聆聽中... 講嘢啦！</p>
          ) : isThinking ? (
            <ThinkingDots />
          ) : response ? (
            <p className="text-white text-sm">{response}</p>
          ) : (
            <p className="text-white/60 text-sm">點擊麥克風開始對話</p>
          )}
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-white/5 rounded-lg p-3 mb-4">
            <p className="text-white/80 text-sm">你講咗：「{transcript}」</p>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Main Page Component
export default function Home() {
  const [activeNav, setActiveNav] = useState<'classic' | 'foryou' | 'builder'>('foryou')
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Sample Cards Data
  const cards: Card[] = [
    {
      id: '1',
      type: 'finance',
      title: '恒生指數',
      subtitle: 'HSI',
      value: '18,432',
      change: '+1.25%',
      mood: 'hot',
      image: '/images/finance-card.png',
      delay: 0,
    },
    {
      id: '2',
      type: 'finance',
      title: '騰訊控股',
      subtitle: '0700.HK',
      value: '388.40',
      change: '+2.18%',
      mood: 'warm',
      image: '/images/finance-card.png',
      delay: 0.5,
    },
    {
      id: '3',
      type: 'life',
      title: '利是錢部署',
      subtitle: '今年收咗幾多？',
      image: '/images/life-card.png',
      delay: 1,
    },
    {
      id: '4',
      type: 'health',
      title: '健康指數',
      subtitle: '今日運動量',
      value: '6,432',
      change: '步',
      mood: 'cool',
      image: '/images/health-card.png',
      delay: 1.5,
    },
    {
      id: '5',
      type: 'voice',
      title: 'Net仔話你知',
      subtitle: '今日大市點睇？',
      image: '/images/voice-card.png',
      delay: 2,
    },
    {
      id: '6',
      type: 'retirement',
      title: '退休倒計時',
      subtitle: '距離65歲',
      value: '11,232',
      change: '日',
      image: '/images/retirement-card.png',
      delay: 2.5,
    },
  ]

  // Handle AI Response
  const handleAIResponse = useCallback(async (text: string) => {
    setIsThinking(true)
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const responses = [
      '今日大市氣氛幾好，恒指升咗超過1%，可以考慮下藍籌股，不過都要留意成交額！',
      '你講得啱！最近科技股表現唔錯，騰訊同美團都有升幅，可以留意下。',
      '利是錢可以考慮做定期或者買基金，唔好淨係放喺床底啦！Net仔建議你可以分散投資。',
      '健康最重要！今日行咗6000幾步，繼續努力！記住每日要飲8杯水呀！',
    ]
    
    setResponse(responses[Math.floor(Math.random() * responses.length)])
    setIsThinking(false)
  }, [])

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'zh-HK'

        recognitionRef.current.onresult = (event) => {
          const current = event.resultIndex
          const transcriptResult = event.results[current][0].transcript
          setTranscript(transcriptResult)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }
      }
    }
  }, [])

  // Handle transcript change to trigger AI response
  useEffect(() => {
    if (transcript && !isListening) {
      handleAIResponse(transcript)
    }
  }, [transcript, isListening, handleAIResponse])

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      alert('你嘅瀏覽器唔支援語音辨識功能，請使用 Chrome 或 Edge 瀏覽器。')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      setTranscript('')
      setResponse('')
      recognitionRef.current.start()
      setIsListening(true)
    }
  }, [isListening])

  const handleCardClick = (card: Card) => {
    if (card.type === 'voice') {
      setIsVoiceModalOpen(true)
    }
  }

  // Generate particles
  const particles = [...Array(20)].map((_, i) => ({
    id: i,
    delay: Math.random() * 10,
    left: Math.random() * 100,
  }))

  return (
    <div className="min-h-screen deep-space-bg relative overflow-hidden">
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <Particle key={p.id} delay={p.delay} left={p.left} />
        ))}
      </div>

      {/* Nebula Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="nebula w-96 h-96 bg-cyan-500/20 top-0 -left-48" />
        <div className="nebula w-80 h-80 bg-purple-500/20 top-1/3 -right-40" />
        <div className="nebula w-72 h-72 bg-blue-500/20 bottom-0 left-1/4" />
      </div>

      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4">
          <div className="max-w-lg mx-auto">
            {/* Search Bar */}
            <div className="glass-card p-3 flex items-center gap-3">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="搜尋股票、新聞、工具..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/40 text-sm"
              />
              {/* Mic Button */}
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className={`w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center transition-transform hover:scale-110 ${isListening ? 'mic-active' : ''}`}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 pb-24 overflow-y-auto">
          <div className="max-w-lg mx-auto">
            {/* Welcome Section */}
            <div className="text-center py-6">
              <h1 className="text-2xl font-bold text-gradient mb-2">ET Light</h1>
              <p className="text-white/60 text-sm">你的輕盈理財夥伴</p>
            </div>

            {/* Net仔 Greeting */}
            <div className="glass-card p-4 mb-6 flex items-center gap-4 glow-blue">
              <Image
                src="/images/netzai-mascot.png"
                alt="Net仔"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <p className="text-white font-medium">早安！Net仔喺度等你</p>
                <p className="text-white/60 text-sm mt-1">今日想睇咩？問我啦！</p>
              </div>
            </div>

            {/* Floating Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {cards.map((card) => (
                <ElementCard
                  key={card.id}
                  card={card}
                  onClick={() => handleCardClick(card)}
                />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6">
              <h2 className="text-white/80 text-sm font-medium mb-3">快速操作</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {['📊 大市概覽', '💰 MPF計算機', '📈 美股報價', '🏠 樓市資訊', '💱 匯率轉換'].map((action, i) => (
                  <button
                    key={i}
                    className="glass-card px-4 py-2 text-sm text-white/80 whitespace-nowrap hover:bg-white/10 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0e1a] to-transparent">
          <div className="max-w-lg mx-auto">
            <div className="glass-card p-2 flex justify-around">
              <button
                onClick={() => setActiveNav('classic')}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  activeNav === 'classic' ? 'nav-active' : 'hover:bg-white/5'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span className="text-xs">傳統</span>
              </button>
              
              <button
                onClick={() => setActiveNav('foryou')}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  activeNav === 'foryou' ? 'nav-active' : 'hover:bg-white/5'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-xs">推薦</span>
              </button>
              
              <button
                onClick={() => setActiveNav('builder')}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  activeNav === 'builder' ? 'nav-active' : 'hover:bg-white/5'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span className="text-xs">自訂</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Voice Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        isListening={isListening}
        transcript={transcript}
        response={response}
        isThinking={isThinking}
      />

      {/* Floating Mic Button */}
      <button
        onClick={() => {
          setIsVoiceModalOpen(true)
          setTimeout(() => toggleListening(), 300)
        }}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg glow-blue hover:scale-110 transition-transform z-40"
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
      </button>
    </div>
  )
}
