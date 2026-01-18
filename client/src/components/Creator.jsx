import { useState } from 'react';
import axios from 'axios';

export default function Creator({ onBack }) {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  
  // États pour le formulaire de création manuelle
  const [qText, setQText] = useState("");
  const [ans, setAns] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState("");

  // Fonction pour ajouter une question manuellement
  const addQuestion = () => {
    if (!qText || !correct || ans.some(a => !a)) {
      return alert("Remplis tous les champs de la question !");
    }
    const newQ = { questionText: qText, options: ans, correctAnswer: correct };
    setQuestions([...questions, newQ]);
    
    // Reset du formulaire
    setQText("");
    setAns(["", "", "", ""]);
    setCorrect("");
  };

  // Fonction magique pour importer un fichier JSON
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setQuestions([...questions, ...imported]);
          alert(`${imported.length} questions importées !`);
        }
      } catch (err) {
        alert("Fichier JSON invalide. Vérifie le format.");
      }
    };
    reader.readAsText(file);
  };

  const publishQuiz = async () => {
    if (!title) return alert("Donne un titre à ton quiz !");
    if (questions.length < 3) return alert("Il faut au moins 3 questions pour publier.");

    try {
      await axios.post('http://localhost:5000/api/quizzes', { title, questions });
      alert("Quiz publié avec succès ! 🚀");
      onBack();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la publication.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="mb-6 text-indigo-400 hover:text-indigo-300 transition">
          ← Retour au menu
        </button>

        <h1 className="text-4xl font-black mb-8 uppercase tracking-tight">Configuration du Quiz</h1>

        {/* INPUT TITRE */}
        <input 
          className="w-full bg-slate-800 border-2 border-slate-700 p-4 rounded-2xl mb-8 focus:border-indigo-500 outline-none text-xl transition-all"
          placeholder="Titre de ton quiz de génie..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {/* ZONE IMPORT JSON */}
        <div className="mb-10 p-6 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/30">
          <label className="block text-sm font-bold text-indigo-400 mb-3 uppercase tracking-widest">
            Importation rapide (Fichier .json)
          </label>
          <input 
            type="file" 
            accept=".json" 
            onChange={handleImportJSON}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* FORMULAIRE AJOUT MANUEL */}
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 h-fit">
            <h2 className="text-xl font-bold mb-4">Ajouter manuellement</h2>
            <input 
              className="w-full bg-slate-700 p-3 rounded-xl mb-4 outline-none focus:ring-2 ring-indigo-500"
              placeholder="Ta question..."
              value={qText}
              onChange={e => setQText(e.target.value)}
            />
            <div className="grid grid-cols-1 gap-3 mb-4">
              {ans.map((a, i) => (
                <input 
                  key={i}
                  className="bg-slate-700 p-3 rounded-xl outline-none focus:ring-2 ring-slate-500 text-sm"
                  placeholder={`Option ${i+1}`}
                  value={a}
                  onChange={e => {
                    const newAns = [...ans];
                    newAns[i] = e.target.value;
                    setAns(newAns);
                  }}
                />
              ))}
            </div>
            <select 
              className="w-full bg-slate-700 p-3 rounded-xl mb-6 outline-none cursor-pointer"
              value={correct}
              onChange={e => setCorrect(e.target.value)}
            >
              <option value="">Quelle est la bonne réponse ?</option>
              {ans.map((a, i) => (
                <option key={i} value={a}>{a || `Option ${i+1}`}</option>
              ))}
            </select>
            <button 
              onClick={addQuestion}
              className="w-full bg-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all"
            >
              Ajouter à la liste
            </button>
          </div>

          {/* LISTE DES QUESTIONS AJOUTÉES */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex justify-between">
              Questions listées <span>{questions.length}</span>
            </h2>
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {questions.length === 0 && <p className="text-slate-500 italic text-sm">Aucune question pour le moment...</p>}
              {questions.map((q, idx) => (
                <div key={idx} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-sm flex justify-between items-center group">
                  <p className="truncate mr-2"><span className="text-indigo-400 font-bold">{idx+1}.</span> {q.questionText}</p>
                  <button 
                    onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>

            {/* BOUTON PUBLIER FINAL */}
            <button 
              onClick={publishQuiz}
              disabled={questions.length < 3}
              className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl ${
                questions.length < 3 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/20'
              }`}
            >
              {questions.length < 3 ? `MINIMUM 3 QUESTIONS (${questions.length}/3)` : "PUBLIER LE QUIZ 🚀"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}