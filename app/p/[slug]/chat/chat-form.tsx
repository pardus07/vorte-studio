'use client'

import { useState, useRef, useEffect } from 'react'
import { trackEvent } from '@/lib/templates/use-track'

interface Props {
  firmName: string
  city: string
  sector: string
  slug: string
}

interface Message {
  role: 'assistant' | 'user'
  text: string
}

export default function ChatForm({ firmName, city, sector, slug }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [step, setStep] = useState<'intro' | 'name' | 'phone' | 'message' | 'done'>('intro')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Otomatik scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Bot mesajı ekle (yazıyor animasyonu ile)
  function addBotMessage(text: string, nextStep: typeof step) {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [...prev, { role: 'assistant', text }])
      setStep(nextStep)
    }, 800 + Math.random() * 400)
  }

  // İlk mesajları başlat
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        {
          role: 'assistant',
          text: `Merhaba! 👋 ${firmName} için özel bir web sitesi teklifi hazırlamak istiyoruz.`,
        },
      ])
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `${city}'da ${sector.toLowerCase()} sektöründe dijital varlığınızı güçlendirmek için tam size uygun bir çözüm sunabiliriz. Birkaç bilgi alabilir miyim?`,
          },
        ])
        setStep('name')
      }, 1200)
    }, 500)

    return () => clearTimeout(timer)
  }, [firmName, city, sector])

  // Form gönder
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = inputValue.trim()
    if (!value) return

    // Kullanıcı mesajını ekle
    setMessages((prev) => [...prev, { role: 'user', text: value }])
    setInputValue('')

    if (step === 'name') {
      setName(value)
      addBotMessage(
        `Teşekkürler ${value}! 😊 Sizi arayabilmemiz için telefon numaranızı alabilir miyim?`,
        'phone',
      )
    } else if (step === 'phone') {
      setPhone(value)
      addBotMessage(
        'Harika! Son olarak, web sitenizle ilgili özel bir isteğiniz veya sorunuz var mı? (Yoksa "Yok" yazabilirsiniz)',
        'message',
      )
    } else if (step === 'message') {
      setUserMessage(value)

      // Track event + form data
      trackEvent(slug, 'CHAT_CLICK')
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          type: 'CHAT_CLICK',
          metadata: {
            contactName: name,
            contactPhone: phone,
            contactMessage: value,
            firmName,
            city,
            sector,
            timestamp: new Date().toISOString(),
          },
        }),
      }).catch(() => {})

      addBotMessage(
        `Teşekkürler! 🎉 Bilgileriniz ekibimize iletildi. En kısa sürede ${name} olarak sizinle iletişime geçeceğiz. Güzel bir gün dileriz!`,
        'done',
      )
    }
  }

  const placeholders: Record<string, string> = {
    name: 'Adınızı yazın...',
    phone: '05XX XXX XX XX',
    message: 'Mesajınızı yazın veya "Yok" yazın...',
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <a
            href={`/p/${slug}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
              V
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Vorte Studio</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Çevrimiçi
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-xl space-y-4">
          {/* Tarih göstergesi */}
          <div className="flex justify-center">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              Bugün
            </span>
          </div>

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-br-md bg-orange-500 text-white'
                    : 'rounded-bl-md bg-white text-slate-700 shadow-sm ring-1 ring-slate-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input area */}
      {step !== 'done' && step !== 'intro' && (
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-3">
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl gap-2">
            <input
              type={step === 'phone' ? 'tel' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholders[step] ?? 'Yazın...'}
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition-all hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Tamamlandı — WhatsApp alternatifi */}
      {step === 'done' && (
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-4">
          <div className="mx-auto max-w-xl text-center">
            <p className="mb-3 text-sm text-slate-500">
              Hemen ulaşmak isterseniz:
            </p>
            <a
              href={`/p/${slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Sayfaya Geri Dön
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
