import { useState } from 'react'

export default function Game({ quiz, onBack }) {
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasAnswered, setHasAnswered] = useState(false)

  const currentQuestion = quiz.questions[step]

  const handleSelect = (option) => {
    if (hasAnswered) return // Bloque le clic si déjà répondu
    setSelectedOption(option)
    setHasAnswered(true)
    
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (step + 1 < quiz.questions.length) {
      setStep(step + 1)
      setSelectedOption(null)
      setHasAnswered(false)
    } else {
      setFinished(true)
    }
  }

  if (finished) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">
      <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl border border-indigo-500/30 text-center animate-in fade-in zoom-in duration-300">
        <h2 className="text-3xl font-bold mb-2">Quiz Terminé !</h2>
        <div className="text-7xl font-black text-indigo-400 mb-6">
          {score} <span className="text-2xl text-slate-500">/ {quiz.questions.length}</span>
        </div>
        <p className="text-slate-400 mb-8 max-w-xs mx-auto">
          {score === quiz.questions.length ? "Que la Force soit avec toi, Maître !" : "Encore beaucoup à apprendre tu as, jeune Padawan."}
        </p>
        <button 
          onClick={onBack} 
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95"
        >
          Retour au Menu
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Barre de progression */}
        <div className="flex justify-between items-end mb-4">
          <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest">Question {step + 1} / {quiz.questions.length}</span>
          <span className="text-slate-500 text-xs font-bold">SCORE: {score}</span>
        </div>
        <div className="w-full bg-slate-800 h-3 rounded-full mb-12 overflow-hidden border border-slate-700">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-500 ease-out" 
            style={{ width: `${((step + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center leading-tight">
            {currentQuestion.questionText}
          </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((opt, i) => {
            // Logique de couleur au clic
            let buttonStyle = "bg-slate-800 border-slate-700 hover:border-indigo-500"
            if (hasAnswered) {
              if (opt === currentQuestion.correctAnswer) {
                buttonStyle = "bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              } else if (opt === selectedOption) {
                buttonStyle = "bg-red-600/20 border-red-500 text-red-400"
              } else {
                buttonStyle = "bg-slate-800/50 border-slate-800 text-slate-500 opacity-50"
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={hasAnswered}
                className={`group relative p-5 rounded-2xl border-2 transition-all duration-200 text-left text-lg font-medium ${buttonStyle}`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {hasAnswered && opt === currentQuestion.correctAnswer && <span>✅</span>}
                  {hasAnswered && opt === selectedOption && opt !== currentQuestion.correctAnswer && <span>❌</span>}
                </div>
              </button>
            )
          })}
        </div>

        {/* Bouton Suivant - N'apparaît que si on a répondu */}
        <div className="mt-10 h-16">
          {hasAnswered && (
            <button 
              onClick={nextQuestion}
              className="w-full h-full bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xl rounded-2xl shadow-lg shadow-indigo-500/25 transition-all animate-in slide-in-from-bottom-4"
            >
              {step + 1 === quiz.questions.length ? "VOIR MON RÉSULTAT" : "QUESTION SUIVANTE →"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}