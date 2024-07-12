const express = require("express");
const Character = require("../../schema/CharacterSchema");
const router = express.Router();


router.post('', async (req, res) => {
    try {
      const character = new Character(req.body);
      const savedCharacter = await character.save();
      res.status(201).json(savedCharacter);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to create character' });
    }
});

router.get('', async (req, res) => {
  try {
    const characters = await Character.find({}); // Fetch all characters
    res.json(characters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve characters' });
  }
});

// 3. Get Character by ID (GET /characters/:id)
router.get('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve character' });
  }
});

// 4. Update Character (PUT /characters/:id)
router.put('/:id', async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.json(character);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update character' });
  }
});

// 5. Delete Character (DELETE /characters/:id)
router.delete('/:id', async (req, res) => {
  try {
    const character = await Character.findByIdAndRemove(req.params.id);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete character' });
  }
});


module.exports = router;