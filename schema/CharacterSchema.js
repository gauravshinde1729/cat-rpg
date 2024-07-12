const mongoose = require('mongoose');

// Character Schema
const characterSchema = new mongoose.Schema({
    name: String,
    class: { type: String, enum: ['Fighter', 'Mage', 'Archer'] },
    heart: { type: String, enum: ['Beauty', 'Kindness', 'Humility', 'Diligence', 'Faith', 'Feral'] },
    level: { type: Number, default: 1 },
    rarity: { type: String, enum: ['R', 'R+', 'SR', 'SR+', 'SSR', 'SSR+', 'UR', 'UR+', 'LR'] },
    baseStats: {
      spd: Number,
      pAtk: Number,
      pDef: Number,
      mAtk: Number,
      mDef: Number,
      critC: Number,
      critR: Number,
      hp: Number
    }
  });

  module.exports =  mongoose.model('Character', characterSchema);
