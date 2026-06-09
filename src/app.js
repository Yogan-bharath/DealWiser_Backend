import express from 'express'
import morgan from 'morgan'
import authRouter from './routes/auth.routes.js'
import wishlistRoutes from "./routes/wishlist.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import publicRoutes from './routes/public.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()

app.use(cors({
  // Use the production URL if it exists, otherwise fallback to localhost
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/products',publicRoutes)
export default app
