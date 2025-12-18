import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDb from './Db/db.js'
import route from './Routes/beatRoutes.js'
import spotifyRoutes from './Routes/spotifyRoutes.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()
connectDb()
app.use(cors())
app.use(express.json())

app.use('/api', route)
app.use('/api/spotify', spotifyRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})