const mongoose = require('mongoose');

// Le schéma d'une question individuelle
const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 1 }
});

// Le schéma du Quiz
const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);