import express from 'express'
import { getEvents, getOngoing, addEvent } from '../handlers/events.js'

const router = express.Router({ mergeParams: true })

router.route('/').get(getEvents)

router.route('/ongoing').get(getOngoing)

router.route('/').post(addEvent)

export default router