import mongoose from 'mongoose';

// Quiz schema: stores question and answers in specified format
const quizSchema = new mongoose.Schema({
  q: { type: String, required: true },
  a: {
    a1: { type: Boolean, required: true },
    a2: { type: Boolean, required: true },
    a3: { type: Boolean, required: true },
    a4: { type: Boolean, required: true }
  },
  user: { type: mongoose.Schema.Types.UUID, ref: 'User', required: true },
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true }
}, { _id: false });

export default quizSchema;