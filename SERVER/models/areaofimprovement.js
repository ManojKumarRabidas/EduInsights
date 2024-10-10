const mongoose = require('mongoose');

const areaOfImprovementSchema = new mongoose.Schema({
    name: {type: 'string', required: true},
    area_for: {type: 'string', required: true},
    active: {type: 'number'},
    createdBy: {type: 'ObjectId'},
    updatedBy: {type: 'ObjectId'}
}, { timestamps: true });

areaOfImprovementSchema.index({ name: 1, area_for: 1 }, { unique: true });
const areaOfImprovementModel = mongoose.model('area_of_improvement', areaOfImprovementSchema)
module.exports = areaOfImprovementModel