import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cookieParser from "cookie-parser";
import tableRouter from './routes/table.routes';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import restaurantRouter from './routes/restaurant.routes';
import { errorHandler } from "./middlewares/error.middleware";
import menuRouter from './routes/menu.routes';
import cartRouter from './routes/cart.routes';
import orderRouter from './routes/order.routes';
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60000,
    max: 100 // Limit each IP to 100 requests per windowMs
}));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter); 
app.use("/api/v1/admin", userRouter);
app.use("/api/v1/restaurant", restaurantRouter);
app.use("/api/v1/restaurants/menu", menuRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/table", tableRouter);

// Global Error Handler
app.use(errorHandler);

export default app;