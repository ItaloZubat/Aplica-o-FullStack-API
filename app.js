const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

const app = express();


app.use(cors({ origin: '*' })); 


app.use(express.json());


mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Banco de dados conectado'))
  .catch(err => console.log('Erro ao conectar ao banco de dados: ' + err));


const User = require('./models/user');


app.post('/api/auth/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {

    const newUser = new User({ username, password, email });
    await newUser.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao registrar usuário: ' + err.message });
  }
});


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }


    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


    res.json({ message: 'Login bem-sucedido!', token });
  } catch (err) {

    console.error('Erro no login:', err.message);


    res.status(500).json({ error: 'Erro ao fazer login. Tente novamente.' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
