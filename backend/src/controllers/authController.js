const prisma = require('../prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const userExists = await prisma.user.findUnique({
      where: { email }
    })

    if (userExists) {
      return res.status(400).json({
        error: 'Email já cadastrado'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    })

    res.status(201).json(user)

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Erro ao cadastrar usuário'
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Senha inválida'
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      'segredo_super_secreto',
      {
        expiresIn: '7d'
      }
    )

    res.json({
      message: 'Login realizado com sucesso',
      token
    })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Erro no login'
    })
  }
}

module.exports = {
  register,
  login
}