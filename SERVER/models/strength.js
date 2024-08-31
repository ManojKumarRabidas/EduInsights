const mongoose = require ('mongoose');

const strengthSchema = new mongoose.Schema({
    name: {type: 'string', required: true},
    strength_for: {type: 'string', required: true},
    active: {type: 'number'},
},{ timestamps: true });

// strengthSchema.index({ name: 1}, {unique: true});
const Strength = mongoose.model('strength',strengthSchema)
module.exports = Strength