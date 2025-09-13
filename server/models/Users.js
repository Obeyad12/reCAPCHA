import mongoose from 'mongoose';
import noteSchema from './Note.js';
import quizSchema from './Quiz.js';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  uuid: { type: String, default: uuidv4, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notes: [noteSchema],   // Array of notes
  quizzes: [quizSchema]  // Array of quizzes
});

const User = mongoose.model('User', userSchema);

export default User;