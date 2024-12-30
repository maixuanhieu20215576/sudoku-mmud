const { Level } = require('../models/level.model');
const { Session } = require('../models/session.model');
const fs = require('fs');
const snarkjs = require('snarkjs');
async function verifyProof(proof, publicSignals, verificationKeyPath) {
    // Load the verification key
    const vKey = JSON.parse(fs.readFileSync(verificationKeyPath, 'utf8'));

    // Verify the proof
    const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (isValid) {
        console.log('Proof is valid!');
    } else {
        console.log('Proof is NOT valid.');
    }

    return isValid;
}

const startSession = async (req, res) => {
    try {
        const { levelId } = req.body;
        const startTime = new Date();
        const status = 'ongoing';
        const session = await Session.create({ levelId, startTime, status });
        console.log('Start Session: ', session._id);
        res.send({
            code: 200,
            sessionId: session._id,
        });
    } catch (err) {
        res.send({
            code: 500,
            error: err.message,
        });
    }
};
const pauseSession = async (req, res) => {
    const { sessionId } = req.params;
    console.log(sessionId);
    try {
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).send({
                code: 404,
                message: 'Session not found',
            });
        }
        session.totalTime = session.totalTime;
        const now = new Date();
        const dif = now - session.startTime;
        session.totalTime += dif;
        const news = await session.save();
        console.log('news: ', news);
        return res.json({ message: 'ok' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const continueSession = async (req, res) => {
    const { sessionId } = req.params;
    console.log(sessionId);
    try {
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).send({
                code: 404,
                message: 'Session not found',
            });
        }
        const now = new Date();
        session.startTime = now;
        const news = await session.save();
        console.log('news: ', news);
        return res.json({ message: 'ok' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const endSession = async (req, res) => {
    const puzzlee = [
        [1, 7, 4, 2, 8, 5, 3, 9, 6],
        [2, 8, 5, 3, 9, 6, 4, 1, 7],
        [3, 9, 6, 4, 1, 7, 5, 2, 8],
        [4, 1, 7, 5, 2, 8, 6, 3, 9],
        [5, 2, 8, 6, 3, 9, 7, 4, 1],
        [6, 3, 9, 7, 4, 1, 8, 5, 2],
        [7, 4, 1, 8, 5, 2, 9, 6, 3],
        [8, 5, 2, 9, 6, 3, 1, 7, 4],
        [9, 6, 3, 1, 7, 4, 2, 8, 5],
    ];

    try {
        const { proof, name, sessionId, level } = req.body;
        let levelInfo = await Level.find({ levelNumber: level });
        levelInfo = levelInfo[0];
        console.log(levelInfo);
        const puzzle = levelInfo.levelData;
        let a = []; //a is publicsignal from server
        for (let i = 0; i < 81; i++) {
            a = [...a, `${puzzle[Math.floor(i / 9)][i % 9]}`];
        }

        const verificationKeyPath = 'verification_key.json'; // Path to verification key
        const isValid = await verifyProof(proof, a, verificationKeyPath);
        console.log('Verification result:', isValid);
        if (isValid) {
            //ok
            const endDate = new Date();
            const session = await Session.findById(sessionId);
            if (!session) {
                return res.status(404).send({
                    code: 404,
                    message: 'Session not found',
                });
            }
            if (session.status == 'completed') {
                return res.status(400).json({ message: 'please reload' });
            }
            const startTime = session.startTime;
            console.log(startTime, endDate);
            const totalTime = session.totalTime + (endDate - startTime);
            const status = 'completed';
            const updateData = { status, totalTime }; //minisecond??
            if (name) {
                updateData.name = name;
            } else {
                updateData.name = 'anonymous';
            }

            await Session.findByIdAndUpdate(sessionId, updateData);
            console.log('end session: ', sessionId);
            res.send({
                code: 200,
                data: {
                    name: updateData.name,
                    totalTime,
                    _id: sessionId,
                },
            });
        } else {
            res.json({ message: 'invalid proof' });
        }
        // return res.json({ data: levelInfo.levelData });
    } catch (err) {
        res.status(500).send({
            code: 500,
            error: err.message,
        });
    }
};

const getHighScore = async (req, res) => {
    const { level } = req.body;
    try {
        const highScore = await Session.find({ status: 'completed', levelId: level }).sort({ totalTime: 1 });

        res.send({
            code: 200,
            highScore,
        });
    } catch (err) {
        res.status(500).send({
            code: 500,
            error: err.message,
        });
    }
};
module.exports = {
    startSession,
    endSession,
    getHighScore,
    continueSession,
    pauseSession,
};
