const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const electionRoutes = require('./routes/electionStateRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const voteRoutes = require('./routes/voteRoutes');
const cors = require('cors');
dotenv.config();

const app = express();

// Connect to the database
connectDB();


// Middleware to parse JSON
app.use(express.json());
const corsOperation = {
    origin: ['http://localhost:5173', 'https://voting-rutvik.netlify.app'],
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD ",
    credentials: true,
}
app.use(cors(corsOperation));


app.use('/uploads', express.static('upload')); // Ensure this is correct

app.use('/api/auth', authRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
