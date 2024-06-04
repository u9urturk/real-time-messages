const express = require('express');
const Message = require('../models/Message');
const router =express.Router();

router.get('/api/messages', async (req, res) => {
    try {
      const messages = await Message.find();
      res.json(messages);
    } catch (err) {
      console.error('Mesajlar getirilirken hata oluştu:', err);
      res.status(500).json({ error: 'Mesajlar getirilirken hata oluştu' });
    }
  });
  

  module.exports = router;
