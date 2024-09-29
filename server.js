require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const emailRoutes = require('./routes/emailRoutes');
const { startEmailFetching } = require('./controllers/emailController'); 

const app = express();
const cors = require('cors');

app.use(cors());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use('/api', emailRoutes);

// Start fetching emails every 10 seconds
const fetchIntervalInSeconds = 10;
startEmailFetching(fetchIntervalInSeconds);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
