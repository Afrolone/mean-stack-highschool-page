const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    type: { type: String, required: true},
    message: { type: String, required: true}
});

module.exports = mongoose.model('Report', reportSchema);