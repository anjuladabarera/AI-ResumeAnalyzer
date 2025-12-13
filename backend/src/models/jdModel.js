import mongoose from 'mongoose';

const JobDescriptionSchema = new mongoose.Schema({

  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },

  title: {
    type: String,
    required: true
  },

  jobDescription: {
    type: String,
    required: true
  },

  matchScore: {
    type: Number,
    default: 0
  },

  analyzedAt: {
    type: Date,
    default: Date.now
  }
  
});

// Export the model
module.exports = mongoose.model('JobDescription', JobDescriptionSchema);
