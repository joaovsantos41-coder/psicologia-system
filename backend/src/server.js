const patientRoutes = require('./routes/patientRoutes')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const authMiddleware = require('./middlewares/authMiddleware')

const consultationRoutes =
  require('./routes/consultationRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)

app.use('/patients', patientRoutes)

app.use('/consultations', consultationRoutes)

app.get('/', (req, res) => {
  res.send('API funcionando')
})

app.get('/dashboard', authMiddleware, (req, res) => {
  res.json({
    message: 'Bem-vindo ao dashboard',
    user: req.user
  })
})

app.listen(3333, () => {
  console.log('Servidor rodando na porta 3333')
})