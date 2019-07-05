import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { eventsRoutes } from './routes/index'
import errorHandler from './handlers/errors'

const app = express()
const PORT = process.env.PORT || 8081

//APP SETUP
app.use(cors())
app.use(bodyParser.json())

//ROUTES HANDLING
app.use('/api/events', eventsRoutes)

//IF USERS ENTER UNFOUND ROUTES, PASS ERROR TO MIDDLEWARE
app.use((req, res, next) => {
    let error = new Error('Not Found')
    error.status = 404
    next(error)
})

//ERROR HANDLING
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`SERVER is listen on PORT ${PORT}`)
})

export default app //FOR TESTING