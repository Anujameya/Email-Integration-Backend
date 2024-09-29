const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  subject: { type: String },
  from: { type: String },
  date: { type: Date, default: Date.now }, // Defaults to current date if not provided
  uid: { type: String, unique: true, required: true }, // Unique identifier for each ticket
  bookingType: { type: String },
  checkInDate: { type: String },
  checkOutDate: { type: String },
  conferenceAndEvents: { type: String },
  destination: { type: String},
  email: { type: String },
  entertainment: { type: String },
  equipment: { type: String },
  hotelStarRating: { type: String },
  meals: { type: String },
  numberOfAdults: { type: String },
  numberOfChildren: { type: String },
  paymentDetails: { type: String },
  phoneNumber: { type: String },
  roomType: { type: String },
  specialMealsAndDrinks: { type: String },
});

module.exports = mongoose.model('Ticket', ticketSchema);
