const mongoose = require('mongoose');

const SessionSchema = mongoose.Schema(
    {
        levelId: {
            type: String,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        totalTime: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
        },
        name: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);
const Session = mongoose.model('Session', SessionSchema);

module.exports = { Session };
