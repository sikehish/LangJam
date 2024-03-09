const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  languageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Language' },
  title: String,
  questions: [
    {
      questionText: String,
      choices: [String],
      correctChoice: Number,
      difficulty: String // EASY, MEDIUM, HARD, etc.
    }
  ],
});

// Calculate maxScore based on the number of questions and difficulty
exerciseSchema.virtual('maxScore').get(function () {
  const questionCount = this.questions.length;
  let score = 0;
  this.questions.forEach((question) => {
    if (question.difficulty === 'EASY') {
      score += 1;
    } else if (question.difficulty === 'MEDIUM') {
      score += 3;
    } else if (question.difficulty === 'HARD') {
      score += 5;
    }
  });
  return score * questionCount;
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
