let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AboutSchema = new Schema({
    text: {
        type: String,
        required: true,
        default: ''
    },
    logo: String
});

module.exports = mongoose.model('About', AboutSchema);