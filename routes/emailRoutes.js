
const express = require('express');
const Ticket = require('../models/Ticket');
const router = express.Router();

// Endpoint to fetch tickets from MongoDB
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Error fetching tickets' });
  }
});

router.get('/tickets/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    // Fetch the ticket by the token field from the database
    const result = await Ticket.findById(id);
    if (!result) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching ticket by token:', error);
    res.status(500).json({ message: 'Error fetching ticket' });
  }
});

module.exports = router;
