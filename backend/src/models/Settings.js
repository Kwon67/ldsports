const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    heroImages: {
      type: [String],
      default: [],
    },
    heroImage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Singleton pattern - sempre usar o mesmo documento
settingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({ heroImages: [], heroImage: '' });
  }
  return settings;
};

settingsSchema.statics.updateSettings = async function (updates) {
  let settings = await this.getSingleton();
  Object.assign(settings, updates);
  await settings.save();
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
