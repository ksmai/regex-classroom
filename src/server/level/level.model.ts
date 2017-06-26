import * as mongoose from 'mongoose';

(mongoose as any).Promise = global.Promise;

export const levelSchema = new mongoose.Schema({
  difficulty: {
    type: Number,
    get: (x: number) => Math.round(x),
    set: (x: number) => Math.round(x),
    required: true,
    unique: true,
    min: 0,
  },

  name: {
    type: String,
    required: true,
  },

  tests: {
    type: [{
      question: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
      },

      answer: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
      },
    }],
    required: true,
    validate: (arr: any[]) => arr && arr.length > 0,
  },
});

levelSchema.statics.getAll = function() {
  return this
    .find({})
    .sort({ difficulty: 1 })
    .exec();
};

levelSchema.statics.get = function(difficulty: number) {
  return this
    .findOne({ difficulty })
    .exec()
    .then((level: any) => {
      if (!level) {
        throw new Error('Level does not exist');
      }

      return level;
    });
};

export const Level = mongoose.model('Level', levelSchema, 'levels');
