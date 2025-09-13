import mongoose from 'mongoose';

// Notes schema: just stores a txt file as a string
const noteSchema = new mongoose.Schema({
  uuid: { type: String, default: uuidv4, unique: true },
  txt: { type: String, required: true },
  user: { type: mongoose.Schema.Types.UUID, ref: 'User', required: true }
}, { _id: false });

export default noteSchema;