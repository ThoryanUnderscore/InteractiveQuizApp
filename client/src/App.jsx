import { useEffect, useState } from 'react'
import axios from 'axios'
import Creator from './components/Creator'
import Game from './components/Game'

export default function App() {
  const [quizzes, setQuizzes] = useState([])
  const [mode, setMode] = useState("menu") // "menu", "create", ou "play"
  const [selectedQuiz, setSelectedQuiz] = useState(null)

  // 1. Récupérer les quiz depuis MongoDB
  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('https://interactivequizapp.onrender.com/api/quizzes')
      setQuizzes(res.data)
    } catch (err) {
      console.error("Erreur lors de la récupération :", err)
    }
  }

  // 2. Supprimer un quiz
  const deleteQuiz = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce quiz définitivement ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/quizzes/${id}`)
        fetchQuizzes() // Rafraîchir la liste
      } catch (err) {
        alert("Erreur lors de la suppression")
      }
    }
  }

  useEffect(() => {
    fetchQuizzes()
  }, [])

  // --- RENDU : MENU PRINCIPAL ---
  if (mode === "menu") return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6 md:p-12 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-tighter">
          Quiz Master Pro
        </h1>
        <p className="text-slate-400">Défiez vos potes ou créez vos propres épreuves</p>
      </header>
      
      <button 
        onClick={() => setMode("create")}
        className="group relative mb-12 bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
      >
        <span className="flex items-center gap-2">
          <span className="text-2xl">+</span> Créer un nouveau challenge
        </span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {quizzes.length === 0 ? (
          <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-500 italic">Aucun quiz disponible... Soyez le premier à en créer un !</p>
          </div>
        ) : (
          quizzes.map(q => (
            <div key={q._id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex justify-between items-center group hover:border-indigo-500 transition-all duration-300 shadow-lg">
              <div>
                <h3 className="text-xl font-bold group-hover:text-indigo-300 transition-colors">{q.title}</h3>
                <p className="text-slate-500 font-mono text-sm">{q.questions?.length || 0} QUESTIONS</p>
              </div>
              
              <div className="flex gap-3">
                {/* Bouton Supprimer */}
                <button 
                  onClick={() => deleteQuiz(q._id)}
                  className="bg-slate-700 hover:bg-red-600/20 hover:text-red-400 p-3 rounded-xl transition-all border border-transparent hover:border-red-500/50"
                  title="Supprimer"
                >
                  🗑️
                </button>

                {/* Bouton Jouer */}
                <button 
                  onClick={() => { setSelectedQuiz(q); setMode("play") }}
                  className="bg-emerald-600 hover:bg-emerald-500 p-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-transform hover:scale-110 active:scale-90"
                >
                  ▶️ <span className="ml-1 font-bold">JOUER</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  // --- RENDU : CRÉATEUR ---
  if (mode === "create") return (
    <Creator onBack={() => { setMode("menu"); fetchQuizzes(); }} />
  )

  // --- RENDU : GAMEPLAY ---
  if (mode === "play") return (
    <Game quiz={selectedQuiz} onBack={() => setMode("menu")} />
  )
}
