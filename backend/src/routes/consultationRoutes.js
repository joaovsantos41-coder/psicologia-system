const express = require('express')

const router = express.Router()

const authMiddleware =
  require('../middlewares/authMiddleware')

const consultationController =
  require('../controllers/consultationController')

router.post(
  '/',
  authMiddleware,
  consultationController.createConsultation
)

router.get(
  '/',
  authMiddleware,
  consultationController.getConsultations
)

router.put(
  '/:id',
  authMiddleware,
  consultationController.updateConsultation
)

router.delete(
  '/:id',
  authMiddleware,
  consultationController.deleteConsultation
)

router.put(
  '/:id/status',
  authMiddleware,
  consultationController.updateConsultationStatus
)

module.exports = router