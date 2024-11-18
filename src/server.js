import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import bankRoutes from './routes/bankRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', bankRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Example query endpoint
app.get('/query', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generic query endpoint (be careful with this in production!)
app.post('/execute', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});