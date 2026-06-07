const prisma = require('../prisma/client')

const createConsultation = async (req, res) => {

  try {

    const { date, notes, patientId, value } = req.body

    const consultation = await prisma.consultation.create({
      data: {
        date: new Date(date),
        notes,
        value,
        patientId,
        psychologistId: req.user.id
      }
    })

    res.status(201).json(consultation)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Erro ao criar consulta'
    })

  }
}

const getConsultations = async (req, res) => {

  try {

    const consultations =
      await prisma.consultation.findMany({

        where: {
          psychologistId: req.user.id
        },

        include: {
          patient: true
        }

      })

    res.json(consultations)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Erro ao buscar consultas'
    })

  }
}

const updateConsultation = async (req, res) => {

  try {

    const { id } = req.params

    console.log(req.body)

    const { date, notes, patientId, value } = req.body

    const consultation =
      await prisma.consultation.update({

        where: {
          id: Number(id)
        },

        data: {
          date: new Date(date),
          notes,
          patientId,
          value
        }

      })

    res.json(consultation)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Erro ao atualizar consulta'
    })

  }
}

const deleteConsultation = async (req, res) => {

  try {

    const { id } = req.params

    await prisma.consultation.delete({
      where: {
        id: Number(id)
      }
    })

    res.json({
      message: 'Consulta excluída'
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Erro ao excluir consulta'
    })

  }
}

const updateConsultationStatus = async (req, res) => {

  try {

    const { id } = req.params
    const { status } = req.body

    const consultation =
      await prisma.consultation.update({

        where: {
          id: Number(id)
        },

        data: {
          status
        }

      })

    res.json(consultation)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Erro ao atualizar status'
    })

  }
}

module.exports = {
  createConsultation,
  getConsultations,
  updateConsultation,
  deleteConsultation,
  updateConsultationStatus
}