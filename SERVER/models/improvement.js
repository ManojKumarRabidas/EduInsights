const mongoose = require('mongoose');

const improvementSchema = new mongoose.Schema({
    name: {type: 'string', required: true},
    area: {type: 'string', required: true},
    active: {type: 'number'},
}, { timestamps: true });

improvementSchema.index({ area: 1 }, { unique: true });
const Improvement = mongoose.model('improvement', improvementSchema)
module.exports = Improvement