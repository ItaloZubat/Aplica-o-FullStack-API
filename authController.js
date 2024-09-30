const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  console.log(req.body); 
  const { username, password, email } = req.body;

  try {
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('E-mail já está em uso.');
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

 
    const user = new User({ username, password: hashedPassword, email });
    await user.save();

    res.status(201).send('Usuário registrado com sucesso!');
  } catch (err) {
    console.log(err);
    res.status(400).send('Erro ao registrar usuário: ' + err.message);
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('Usuário não encontrado');


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Senha incorreta');


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send('Erro no login: ' + err.message);
  }
};


exports.authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send('Token não fornecido.');
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Token inválido');
  }
};
