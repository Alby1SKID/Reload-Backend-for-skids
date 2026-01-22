const mongoose = require('mongoose');

const arenaSchema = new mongoose.Schema(
    {
        accountId: { type: String, required: true, unique: true },
        hype: { type: Number, default: 0 },
        division: { type: Number, default: 0 }
    },
    {
        collection: "arena"
    }
);

const Arena = mongoose.model('ArenaSchema', arenaSchema);

module.exports = Arena;
