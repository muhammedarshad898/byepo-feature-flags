const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const authRoutes=require('./Routes/authRoutes')
const superAdminRoutes=require('./Routes/superAdminRoutes')
const flagRoutes=require('./Routes/flagRoutes')
const publicRoutes=require('./Routes/publicRoutes')


const app = express()


app.use(cors())
app.use(express.json())  
app.use('/api/auth', authRoutes) 
app.use('/api/superadmin',superAdminRoutes)
app.use('/api/flags',flagRoutes)
app.use('/api/public',publicRoutes)
app.get('/', (req, res) => {
  res.send('Feature flag backend is running')
})
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch(err => console.error('MongoDB connection failed:', err))