const express = require('express')

const router = express.Router()

const authMiddleware = require('../middlewares/authMiddleware')

const patientController = require('../controllers/patientController')

router.post(
  '/',
  authMiddleware,
  patientController.createPatient
)

router.get(
  '/',
  authMiddleware,
  patientController.getPatients
)

router.put(
  '/:id',
  authMiddleware,
  patientController.updatePatient
)

router.delete(
  '/:id',
  authMiddleware,
  patientController.deletePatient
)

module.exports = router