import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/ddmobbank', async (req, res) => {
  try {
    const queries = [
      `SELECT DISTINCT bank_name
       FROM bb_internet_banking_statistics
       ORDER BY bank_name`,
      
      `SELECT 
          MIN(month) AS min_month, 
          MAX(month) AS max_month
       FROM bb_internet_banking_statistics`
    ];

    const [bankNames, monthRange] = await Promise.all(
      queries.map(query => pool.query(query))
    );

    const response = {
      banks: bankNames[0],
      monthRange: monthRange[0][0]
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/internet-dashboard', async (req, res) => {
  try {
    const queries = [
      `SELECT month, bank_name, active_users AS value, 'active_users' AS metric
       FROM bank_data
       WHERE month = (SELECT MAX(month) FROM bank_data)
       ORDER BY active_users DESC
       LIMIT 3`,
      
      `SELECT month, bank_name, no_of_transactions AS value, 'no_of_transactions' AS metric
       FROM bank_data
       WHERE month = (SELECT MAX(month) FROM bank_data)
       ORDER BY no_of_transactions DESC
       LIMIT 3`,
      
      `SELECT month, bank_name, amt_of_transactions AS value, 'amt_of_transactions' AS metric
       FROM bank_data
       WHERE month = (SELECT MAX(month) FROM bank_data)
       ORDER BY amt_of_transactions DESC
       LIMIT 3`
    ];

    const results = await Promise.all(
      queries.map(query => pool.query(query))
    );

    const response = {
      active_users: results[0][0],
      no_of_transactions: results[1][0],
      amt_of_transactions: results[2][0]
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;