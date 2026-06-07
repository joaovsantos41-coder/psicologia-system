const prisma = require('../prisma/client')

const createPatient = async (req, res) => {
  try {
    const { name, email, phone, birthDate, notes } = req.body

    const patient = await prisma.patient.create({
      data: {
        name,
        email,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null,
        notes,
        psychologistId: req.user.id
      }
    })

    res.status(201).json(patient)

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Erro ao criar paciente'
    })
  }
}

const getPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      where: {
        psychologistId: req.user.id
      }
    })

    res.json(patients)

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Erro ao buscar pacientes'
    })
  }
}

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params

    const { name, email, phone, birthDate, notes } = req.body

    const patient = await prisma.patient.update({
      where: {
        id: Number(id)
      },
      data: {
        name,
        email,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null,
        notes
      }
    })

    res.json(patient)

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Erro ao atualizar paciente'
    })
  }
}

const deletePatient = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.patient.delete({
      where: {
        id: Number(id)
      }
    })

    res.json({
      message: 'Paciente deletado com sucesso'
    })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Erro ao deletar paciente'
    })
  }
}

module.exports = {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient
}