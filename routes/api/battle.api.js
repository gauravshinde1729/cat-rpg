const express = require("express");
const Character = require("../../schema/CharacterSchema");
const router = express.Router();
const { simulateBattle } = require("./battle.logic")


router.post('', async (req, res) => {
    try {
        const { playerPartyIds, enemyPartyIds } = req.body;

        // Fetch characters from the database
        const playerParty = await Character.find({ _id: { $in: playerPartyIds } });
        const enemyParty = await Character.find({ _id: { $in: enemyPartyIds } });

        // Basic input validation
        if (!playerParty.length || !enemyParty.length) {
            return res.status(400).json({ error: 'Invalid party data' });
        }

        // Simulate the battle (implementation details below)
        const battleResult = await simulateBattle(playerParty, enemyParty);

        res.json(battleResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Battle simulation failed' });
    }
});



module.exports = router