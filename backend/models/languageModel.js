const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  name: String,
  exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }]
});

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;
