const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: String,
  description: String,
  link: String
});

const UserProfileSchema = new Schema({
  name: { type: String },
  email: { type: String },
  skills: [String],
  projects: [ProjectSchema],
  github: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
