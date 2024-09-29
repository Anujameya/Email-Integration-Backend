
// const axios = require('axios'); // Make sure to install axios
// const Imap = require('imap');
// const { simpleParser } = require('mailparser');
// const Ticket = require('../models/Ticket');
// require('dotenv').config();

// // Helper function to get already processed UIDs
// const getProcessedUIDs = async () => {
//   try {
//     const tickets = await Ticket.find({}, 'uid');
//     return new Set(tickets.map(ticket => ticket.uid));
//   } catch (error) {
//     console.error('Error fetching processed UIDs:', error);
//     return new Set();
//   }
// };

// // Helper function to get the date of the most recent email check (last 24 hours)
// const getRecentDate = () => {
//   const now = new Date();
//   now.setDate(now.getDate() - 1); // Fetch emails from the last day
//   return now;
// };

// const fetchEmails = async () => {
//   const imap = new Imap({
//     user: process.env.EMAIL_USER,
//     password: process.env.EMAIL_PASS, // Use app-specific password if 2FA is enabled
//     host: 'imap.gmail.com',
//     port: 993,
//     tls: true,
//     authTimeout: 3000,
//     tlsOptions: { rejectUnauthorized: false },
//   });

//   imap.once('ready', async function () {
//     imap.openBox('INBOX', false, async function (err, box) {
//       if (err) {
//         console.error('Error opening inbox:', err);
//         imap.end();
//         return;
//       }

//       try {
//         const recentDate = getRecentDate(); // Get the date for fetching recent emails
//         const processedUIDs = await getProcessedUIDs(); // Get previously processed UIDs

//         imap.search([['SINCE', recentDate], 'UNSEEN'], function (err, results) {
//           if (err) {
//             console.error('Error searching emails:', err);
//             imap.end();
//             return;
//           }

//           if (!results || !results.length) {
//             console.log('No recent unseen emails.');
//             imap.end();
//             return;
//           }

//           const newResults = results.filter(uid => !processedUIDs.has(uid)); // Only unprocessed UIDs
//           if (newResults.length === 0) {
//             console.log('No new unseen emails to process.');
//             imap.end();
//             return;
//           }

//           const f = imap.fetch(newResults, { bodies: '', markSeen: true }); // Fetch unseen and mark them as read

//           f.on('message', function (msg) {
//             msg.on('body', function (stream) {
//               simpleParser(stream, async (err, parsed) => {
//                 if (err) {
//                   console.error('Error parsing email:', err);
//                   return;
//                 }

//                 try {
//                   const emailContent = parsed.text || ''; // Get the email body
                  
//                   // Send request to extract information
//                   const response = await axios.post('http://23.22.202.139:8000/extract-info', {
//                     email_content: emailContent
//                   });

//                   // Assuming the response data is structured as expected
//                   const extractedData = response.data;

//                   const newTicket = new Ticket({
//                     subject: parsed.subject || 'No Subject',
//                     from: parsed.from.text || 'Unknown Sender',
//                     date: parsed.date || new Date(),
//                     uid: parsed.headers.get('message-id') || new Date().toISOString(), // Fallback if no message ID
//                     bookingType: extractedData['Booking Type'],
//                     checkInDate: extractedData['Check-in Date'],
//                     checkOutDate: extractedData['Check-out Date'],
//                     conferenceAndEvents: extractedData['Conference and Events'],
//                     destination: extractedData['Destination'],
//                     email: extractedData['Email'],
//                     entertainment: extractedData['Entertainment'],
//                     equipment: extractedData['Equipment'],
//                     hotelStarRating: extractedData['Hotel Star Rating'],
//                     meals: extractedData['Meals'],
//                     numberOfAdults: extractedData['Number of Adults'],
//                     numberOfChildren: extractedData['Number of Children'],
//                     paymentDetails: extractedData['Payment Details'],
//                     phoneNumber: extractedData['Phone Number'],
//                     roomType: extractedData['Room Type'],
//                     specialMealsAndDrinks: extractedData['Special Meals and Drinks'],
//                   });

//                   await newTicket.save(); // Save ticket to database
//                   console.log('Ticket saved:', newTicket);

//                 } catch (error) {
//                   console.error('Error processing email and saving ticket:', error);
//                 }
//               });
//             });
//           });

//           f.once('end', function () {
//             console.log('Done fetching new unseen emails.');
//             imap.end();
//           });
//         });
//       } catch (error) {
//         console.error('Error during email fetching:', error);
//         imap.end();
//       }
//     });
//   });

//   imap.once('error', function (err) {
//     console.error('IMAP connection error:', err);
//   });

//   imap.connect();
// };

// // Function to periodically check for emails
// const startEmailFetching = (intervalInSeconds) => {
//   fetchEmails(); // Initial fetch when the function is called
//   setInterval(() => {
//     fetchEmails(); // Fetch emails automatically every intervalInSeconds seconds
//   }, intervalInSeconds * 1000);
// };

// module.exports = { startEmailFetching };




const axios = require('axios'); // Make sure to install axios
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const Ticket = require('../models/Ticket');
require('dotenv').config();

// Helper function to get already processed UIDs
const getProcessedUIDs = async () => {
  try {
    const tickets = await Ticket.find({}, 'uid');
    return new Set(tickets.map(ticket => ticket.uid));
  } catch (error) {
    console.error('Error fetching processed UIDs:', error);
    return new Set();
  }
};

// Helper function to get the date of the most recent email check (last 24 hours)
const getRecentDate = () => {
  const now = new Date();
  now.setDate(now.getDate() - 1); // Fetch emails from the last day
  return now;
};

const fetchEmails = async () => {
  const imap = new Imap({
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS, // Use app-specific password if 2FA is enabled
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    authTimeout: 3000,
    tlsOptions: { rejectUnauthorized: false },
  });

  imap.once('ready', async function () {
    imap.openBox('INBOX', false, async function (err, box) {
      if (err) {
        console.error('Error opening inbox:', err);
        imap.end();
        return;
      }

      try {
        const recentDate = getRecentDate(); // Get the date for fetching recent emails
        const processedUIDs = await getProcessedUIDs(); // Get previously processed UIDs

        const senderEmail = 'hellscode5055@gmail.com'; // The email address you want to filter by

        imap.search([['SINCE', recentDate], ['FROM', senderEmail], 'UNSEEN'], function (err, results) {
          if (err) {
            console.error('Error searching emails:', err);
            imap.end();
            return;
          }

          if (!results || !results.length) {
            console.log('No recent unseen emails from the specified sender.');
            imap.end();
            return;
          }

          const newResults = results.filter(uid => !processedUIDs.has(uid)); // Only unprocessed UIDs
          if (newResults.length === 0) {
            console.log('No new unseen emails to process.');
            imap.end();
            return;
          }

          const f = imap.fetch(newResults, { bodies: '', markSeen: true }); // Fetch unseen and mark them as read

          f.on('message', function (msg) {
            msg.on('body', function (stream) {
              simpleParser(stream, async (err, parsed) => {
                if (err) {
                  console.error('Error parsing email:', err);
                  return;
                }

                try {
                  const emailContent = parsed.text || ''; // Get the email body
                  
                  // Send request to extract information
                  const response = await axios.post('http://23.22.202.139:8000/extract-info', {
                    email_content: emailContent
                  });

                  // Assuming the response data is structured as expected
                  const extractedData = response.data;

                  const newTicket = new Ticket({
                    subject: parsed.subject || 'No Subject',
                    from: parsed.from.text || 'Unknown Sender',
                    date: parsed.date || new Date(),
                    uid: parsed.headers.get('message-id') || new Date().toISOString(), // Fallback if no message ID
                    bookingType: extractedData['Booking Type'],
                    checkInDate: extractedData['Check-in Date'],
                    checkOutDate: extractedData['Check-out Date'],
                    conferenceAndEvents: extractedData['Conference and Events'],
                    destination: extractedData['Destination'],
                    email: extractedData['Email'],
                    entertainment: extractedData['Entertainment'],
                    equipment: extractedData['Equipment'],
                    hotelStarRating: extractedData['Hotel Star Rating'],
                    meals: extractedData['Meals'],
                    numberOfAdults: extractedData['Number of Adults'],
                    numberOfChildren: extractedData['Number of Children'],
                    paymentDetails: extractedData['Payment Details'],
                    phoneNumber: extractedData['Phone Number'],
                    roomType: extractedData['Room Type'],
                    specialMealsAndDrinks: extractedData['Special Meals and Drinks'],
                  });

                  await newTicket.save(); // Save ticket to database
                  console.log('Ticket saved:', newTicket);

                } catch (error) {
                  console.error('Error processing email and saving ticket:', error);
                }
              });
            });
          });

          f.once('end', function () {
            console.log('Done fetching new unseen emails.');
            imap.end();
          });
        });
      } catch (error) {
        console.error('Error during email fetching:', error);
        imap.end();
      }
    });
  });

  imap.once('error', function (err) {
    console.error('IMAP connection error:', err);
  });

  imap.connect();
};

// Function to periodically check for emails
const startEmailFetching = (intervalInSeconds) => {
  fetchEmails(); // Initial fetch when the function is called
  setInterval(() => {
    fetchEmails(); // Fetch emails automatically every intervalInSeconds seconds
  }, intervalInSeconds * 1000);
};

module.exports = { startEmailFetching };
