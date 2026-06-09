import app from './src/app.js'
import ConnectDB from './src/config/database.js';
const PORT = process.env.PORT || 3000
// const cors = require('cors')
// app.use(cors())
ConnectDB()
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

