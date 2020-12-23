const mongoose = require('mongoose');

const alumnusSchema = mongoose.Schema({
    name: { type: String, required: true},
    profession: { type: String, required: true},
    bio: { type: String, required: true },
    imagePath: { type: String, required: true }
});

module.exports = mongoose.model('Alumnus', alumnusSchema);