const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO credentials (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    const token = jwt.sign(
      { userId: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ 
      message: 'User created successfully',
      userId: result.insertId,
      token 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.execute(
      'SELECT * FROM credentials WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch == false) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ 
      userId: user.id,
      username: user.username,
      token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Search Users
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    const [users] = await pool.execute(
      `SELECT id, username, email 
       FROM credentials 
       WHERE username LIKE ? OR email LIKE ?`,
      [`%${query}%`, `%${query}%`]
    );
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { signup, login, searchUsers };