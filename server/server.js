const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// On importe le plan du quiz qu'on a créé
const Quiz = require('./Quiz'); 

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB !"))
  .catch(err => console.error("❌ Erreur :", err));

// --- TA PREMIÈRE ROUTE : CRÉER UN QUIZ ---
app.post('/api/quizzes', async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body); // On récupère les infos envoyées par le site
    await newQuiz.save(); // On enregistre dans la base
    res.status(201).json({ message: "Quiz créé avec succès !", quiz: newQuiz });
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la création", details: err });
  }
});

// --- TA DEUXIÈME ROUTE : VOIR TOUS LES QUIZ ---
app.get('/api/quizzes', async (req, res) => {
  try {
    const allQuizzes = await Quiz.find();
    res.json(allQuizzes);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});



// Route pour supprimer un quiz par son ID
app.delete('/api/quizzes/:id', async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }
    res.json({ message: "Quiz supprimé avec succès !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));