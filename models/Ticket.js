const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  from: { type: String, required: true },
  date: { type: Date, default: Date.now }, // Defaults to current date if not provided
  uid: { type: String, unique: true, required: true }, // Unique identifier for each ticket
  bookingType: { type: String, required: true },
  checkInDate: { type: String, required: true },
  checkOutDate: { type: String, required: true },
  conferenceAndEvents: { type: String },
  destination: { type: String, required: true },
  email: { type: String },
  entertainment: { type: String },
  equipment: { type: String },
  hotelStarRating: { type: String },
  meals: { type: String },
  numberOfAdults: { type: String, required: true },
  numberOfChildren: { type: String },
  paymentDetails: { type: String },
  phoneNumber: { type: String },
  roomType: { type: String },
  specialMealsAndDrinks: { type: String },
});

module.exports = mongoose.model('Ticket', ticketSchema);
