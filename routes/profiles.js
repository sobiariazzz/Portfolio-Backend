const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const UserProfile = require('../models/UserProfile');

// Create or Update profile (upsert)
router.post('/', auth, async (req, res) => {
  const userId = req.user.id;
  const { name, email, skills, projects, github } = req.body;
  try {
    let profile = await UserProfile.findOne({ userId });
    const data = { name, email, skills, projects, github, userId };
    if (profile) {
      profile = await UserProfile.findOneAndUpdate({ userId }, data, { new: true });
      return res.json(profile);
    }
    profile = new UserProfile(data);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get own profile
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get profile by id (public)
router.get('/:id', async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update profile (only owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    if (profile.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const { name, email, skills, projects, github } = req.body;
    profile.name = name;
    profile.email = email;
    profile.skills = skills;
    profile.projects = projects;
    profile.github = github;

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete profile (only owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    if (profile.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await profile.remove();
    res.json({ message: 'Profile removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
